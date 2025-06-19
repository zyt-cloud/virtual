import { VirtualListProps } from '../typings';
import { useVirualizer } from '../hooks/useVirtualizer';
import { useRef } from 'react';

/**
 * @param param0
 * @returns
 */
export function NormalVirtualList({
  children,
  className,
  itemClassName,
  style,
  itemStyle,
  ...props
}: VirtualListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirualizer(props, containerRef);

  const totalSize = virtualizer.getTotalSize();

  return (
    <div
      className={className}
      style={{ overflow: 'auto', ...style }}
      ref={containerRef}
    >
      <div
        style={{
          height: props.horizontal ? '100%' : totalSize,
          width: props.horizontal ? totalSize : '100%',
          display: 'grid',
          gridTemplateAreas: `"item"`,
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.index}
            className={itemClassName}
            // ref={virtualizer.elementMounted}
            data-index={virtualItem.index}
            style={{
              ...itemStyle,
              gridArea: 'item',
              height: props.horizontal ? void 0 : virtualItem.size,
              width: props.horizontal ? virtualItem.size : void 0,
              transform: props.horizontal
                ? `translateX(${virtualItem.start}px)`
                : `translateY(${virtualItem.start}px)`,
              // transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
            }}
          >
            {children(virtualItem)}
          </div>
        ))}
      </div>
    </div>
  );
}
