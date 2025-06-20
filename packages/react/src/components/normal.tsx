import { VirtualListProps } from '../typings';
import { useVirualizer } from '../hooks/use-virtualizer';
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
  dynamicSize = false,
  ...props
}: VirtualListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirualizer(props, containerRef);

  const { lanes = 1, horizontal } = props;
  const totalSize = virtualizer.getTotalSize();

  let gridTemplateAreas = Array.from({ length: lanes }, (_, index) =>
    horizontal ? `"lane${index}"` : `lane${index}`,
  ).join(' ');

  if (!horizontal) {
    gridTemplateAreas = `"${gridTemplateAreas}"`;
  }

  return (
    <div
      className={className}
      style={{ overflow: 'auto', ...style }}
      ref={containerRef}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateAreas,
          gridTemplateColumns: `repeat(${horizontal ? 1 : lanes}, 1fr)`,
          gridTemplateRows: `repeat(${horizontal ? lanes : 1}, 1fr)`,
          alignItems: dynamicSize && !horizontal ? 'start' : 'stretch',
          justifyItems: dynamicSize && horizontal ? 'start' : 'stretch',
          columnGap: horizontal ? void 0 : props.gap,
          rowGap: horizontal ? props.gap : void 0,
          height: props.horizontal ? '100%' : totalSize,
          width: props.horizontal ? totalSize : '100%',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.index}
            className={itemClassName}
            ref={dynamicSize ? virtualizer.elementMounted : void 0}
            data-index={virtualItem.index}
            style={{
              ...itemStyle,
              gridArea: `lane${virtualItem.lane}`,
              height: horizontal || dynamicSize ? void 0 : virtualItem.size,
              width: !horizontal || dynamicSize ? void 0 : virtualItem.size,
              transform: props.horizontal
                ? `translateX(${virtualItem.start}px)`
                : `translateY(${virtualItem.start - (props.followPageScroll ? (virtualizer.options.scrollMargin ?? 0) : 0)}px)`,
            }}
          >
            {children(virtualItem)}
          </div>
        ))}
      </div>
    </div>
  );
}
