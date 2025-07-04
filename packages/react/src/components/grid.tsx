import { VirtualListProps } from '../typings'
import { useVirualizer, useIsomorphicLayoutEffect } from '../hooks/use-virtualizer'
import { Fragment, useRef } from 'react'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirualizer(
    {
      ...props,
      size: gridSize?.[1] ?? size,
      // grid 模式当前虚拟器只能竖向滚动
      horizontal: false,
    },
    containerRef,
  )

  const colVirtualizer = useVirualizer(
    { ...props, size: gridSize?.[0] ?? size, horizontal: true },
    containerRef,
  )

  const rowTotalSize = rowVirtualizer.getTotalSize()
  const colTotalSize = colVirtualizer.getTotalSize()

  useIsomorphicLayoutEffect(() => {
    const scrollElement = props.followPageScroll ? window : containerRef.current!
    rowVirtualizer.init(scrollElement)
    colVirtualizer.init(scrollElement)

    if (rowVirtualizer && colVirtualizer) {
      onReady?.(rowVirtualizer, colVirtualizer)
    }

    return () => {
      rowVirtualizer.clean()
      colVirtualizer.clean()
    }
  }, [rowVirtualizer, colVirtualizer])

  return (
    <div className={className} style={{ overflow: 'auto', ...style }} ref={containerRef}>
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
                style={{
                  ...itemStyle,
                  gridArea: 'item',
                  height: rowItem.size,
                  width: colItem.size,
                  transform: `translate(${colItem.start}px,${rowItem.start}px)`,
                }}
              >
                {children(rowItem, colItem)}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
