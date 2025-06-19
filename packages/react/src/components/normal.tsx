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
  dynamicSize = false,
  ...props
}: VirtualListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirualizer(props, containerRef);

  const lanes = props.lanes ?? 1;

  const totalSize = virtualizer.getTotalSize();
  const gridTemplateAreas = `'${Array.from({ length: lanes }, (_, index) =>
    props.horizontal && lanes > 1 ? `'lane${index}'` : `lane${index}`,
  ).join(' ')}'`;

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
          columnGap: props.gap,
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
              height: props.horizontal ? void 0 : virtualItem.size,
              width: props.horizontal ? virtualItem.size : void 0,
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
