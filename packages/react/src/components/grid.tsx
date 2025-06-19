import { VirtualListProps } from '../typings';
import {
  useVirualizer,
  useIsomorphicLayoutEffect,
} from '../hooks/useVirtualizer';
import { Fragment, useRef } from 'react';

/**
 * grid 模式暂不支持动态尺寸
 * @param param0
 * @returns
 */
export function GridVirtualList({
  children,
  className,
  itemClassName,
  style,
  itemStyle,
  grid,
  gridSize,
  size,
  onReady,
  ...props
}: VirtualListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirualizer(
    { ...props, size: gridSize?.[1] ?? size },
    containerRef,
  );

  const colVirtualizer = useVirualizer(
    { ...props, size: gridSize?.[0] ?? size, horizontal: true },
    containerRef,
  );

  const rowTotalSize = rowVirtualizer.getTotalSize();
  const colTotalSize = colVirtualizer.getTotalSize();

  useIsomorphicLayoutEffect(() => {
    if (rowVirtualizer && colVirtualizer) {
      onReady?.(rowVirtualizer, colVirtualizer);
    }
  }, [rowVirtualizer, colVirtualizer]);

  return (
    <div
      className={className}
      style={{ overflow: 'auto', ...style }}
      ref={containerRef}
    >
      <div
        style={{
          height: rowTotalSize,
          width: colTotalSize,
          display: 'grid',
          gridTemplateAreas: `"item"`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((rowItem) => (
          <Fragment key={rowItem.key}>
            {colVirtualizer.getVirtualItems().map((colItem) => (
              <div
                key={colItem.index}
                className={itemClassName}
                // ref={virtualizer.elementMounted}
                style={{
                  ...itemStyle,
                  gridArea: 'item',
                  height: rowItem.size,
                  width: colItem.size,
                  transform: `translateX(${colItem.start}px) translateY(${rowItem.start}px)`,
                  // transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
                }}
              >
                {children(rowItem, colItem)}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
