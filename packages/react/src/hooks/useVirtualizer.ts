import {
  RefObject,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import {
  BrowserVirtualizer,
  type VirtualizerOptions,
} from '@z-cloud/virtual-browser';
import { canUseDom } from '@z-cloud/virtual-vanilla';
import { VirtualListProps } from '../typings';

export const useIsomorphicLayoutEffect = canUseDom
  ? useLayoutEffect
  : useEffect;

export function useVirualizer(
  { onReady, onChange, ...props }: Omit<VirtualListProps, 'children'>,
  containerRef: RefObject<HTMLDivElement | null>,
) {
  const rerender = useReducer(() => ({}), {})[1];

  const options: VirtualizerOptions<HTMLElement | Window> = {
    getScrollElement: () => /* window */ containerRef.current,
    ...props,
    // scrollMargin: containerRef.current?.offsetTop ?? 0,
    onChange: (scrolling) => {
      if (scrolling) {
        flushSync(rerender);
      } else {
        rerender();
      }
      onChange?.(scrolling);
    },
  };

  const [virtualizer] = useState(() => new BrowserVirtualizer(options));

  virtualizer.setOptions(options);

  useIsomorphicLayoutEffect(() => {
    virtualizer.init();
    onReady?.(virtualizer);

    return () => virtualizer.clean();
  }, [virtualizer]);

  return virtualizer;
}
