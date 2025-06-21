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
  getElementOffsetTop,
  type VirtualizerOptions,
} from '@z-cloud/virtual-browser';
import { canUseDom } from '@z-cloud/virtual-vanilla';
import { VirtualListProps } from '../typings';

export const useIsomorphicLayoutEffect = canUseDom
  ? useLayoutEffect
  : useEffect;

export function useVirualizer(
  {
    onReady,
    onChange,
    followPageScroll,
    ...props
  }: Omit<VirtualListProps, 'children'>,
  containerRef: RefObject<HTMLDivElement | null>,
) {
  const rerender = useReducer(() => ({}), {})[1];

  const options: VirtualizerOptions<HTMLElement | Window> = {
    getScrollElement: () => (followPageScroll ? window : containerRef.current),
    scrollMargin: followPageScroll
      ? getElementOffsetTop(containerRef.current)
      : 0,
    ...props,
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

  return virtualizer;
}
