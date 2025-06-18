import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import {
  BrowserVirtualizer,
  type VirtualizerOptions,
} from '@z-cloud/virtual-browser';
import { canUseDom } from '@z-cloud/virtual-vanilla';
import type { VirtualItem } from '@z-cloud/virtual-vanilla';

const useIsomorphicLayoutEffect = canUseDom ? useLayoutEffect : useEffect;

/**
 * TODO:
 * 1、返回实例
 * 2、grid布局
 * 3、页面滚动模式
 * @param param0
 * @returns
 */
export function VirtualList({
  children,
  ...props
}: Omit<VirtualizerOptions<HTMLElement | Window>, 'getScrollElement'> & {
  children: (item: VirtualItem) => React.ReactNode;
}) {
  const rerender = useReducer(() => ({}), {})[1];
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const options: VirtualizerOptions<HTMLElement | Window> = {
    getScrollElement: () => window /* scrollElementRef.current */,
    ...props,
    scrollMargin: scrollElementRef.current?.offsetTop ?? 0,
    onChange: (scrolling) => {
      if (scrolling) {
        flushSync(rerender);
      } else {
        rerender();
      }
      props.onChange?.(scrolling);
    },
  };

  const [virtualizer] = useState(() => new BrowserVirtualizer(options));

  virtualizer.setOptions(options);

  useIsomorphicLayoutEffect(() => {
    virtualizer.init();
    return () => virtualizer.clean();
  }, [virtualizer]);

  return (
    <div>
      <p className="flex gap-x-4">
        <a
          onClick={() =>
            virtualizer.scrollToIndex(5000, {
              align: 'center',
              behavior: 'smooth',
            })
          }
        >
          scroll to index 1000
        </a>
        <a onClick={() => virtualizer.scrollToOffset(1000, 'smooth')}>
          scroll to offset 1000
        </a>
      </p>
      <div
        className="List"
        style={{ width: 400 }}
        ref={
          scrollElementRef
        } /* style={{ width: 400, height: 400, overflow: 'auto' }} */
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.index}
              className={virtualItem.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
              // ref={virtualizer.elementMounted}
              data-index={virtualItem.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualItem.size,
                // transform: `translateY(${virtualItem.start}px)`,
                transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              {children(virtualItem)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
