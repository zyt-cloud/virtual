import { VirtualListProps } from '../typings'
import { useVirualizer, useIsomorphicLayoutEffect } from '../hooks/use-virtualizer'
import { Fragment } from 'react'
import { ScrollView, View } from '@tarojs/components'
import {
  getRectSizeAsync,
  getScrollViewContextNode,
  getWindowRect,
  virtualizerUUID,
} from '../utils'
import Taro from '@tarojs/taro'
import type { MiniVirtualizer } from '@z-cloud/virtual-mini'

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
  const scrollId = `zcloud-virtual-list-${virtualizerUUID.value++}`
  const rowVirtualizer = useVirualizer({
    ...props,
    size: gridSize?.[1] ?? size,
    // 滚动模式只能竖向滚动
    horizontal: false,
  })

  const colVirtualizer = useVirualizer({ ...props, size: gridSize?.[0] ?? size, horizontal: true })

  const rowTotalSize = rowVirtualizer.getTotalSize()
  const colTotalSize = colVirtualizer.getTotalSize()

  const onScroll = (e: any) => {
    rowVirtualizer.onScroll(e.detail)
    colVirtualizer.onScroll(e.detail)
  }

  const init = async () => {
    const windowRect = getWindowRect()
    const elementRect = await getRectSizeAsync(scrollId)
    const scrollNode: any = await getScrollViewContextNode(scrollId)

    rowVirtualizer.setScrollElementRect(props.followPageScroll ? windowRect : elementRect)

    rowVirtualizer.scrollTo = function (this: MiniVirtualizer, offset, behavior) {
      if (!scrollNode) {
        console.warn('获取scrollNode失败')
        return
      }

      scrollNode.scrollTo({
        [this.options.horizontal ? 'left' : 'top']: offset,
        animated: props.dynamicSize ? false : behavior === 'smooth',
      })
    }

    if (props.followPageScroll) {
      rowVirtualizer.options.scrollMargin = elementRect.top ?? 0
      rowVirtualizer.scrollTo = (offset, behavior) => {
        Taro.pageScrollTo({
          scrollTop: offset,
          // 动态尺寸不支持滚动动画
          duration: behavior === 'smooth' && !props.dynamicSize ? 300 : 0,
        })
      }
    }

    colVirtualizer.setScrollElementRect(elementRect)
    colVirtualizer.scrollTo = rowVirtualizer.scrollTo ?? (() => {})
    rowVirtualizer.init()
    colVirtualizer.init()

    if (rowVirtualizer && colVirtualizer) {
      onReady?.(rowVirtualizer, colVirtualizer)
    }
  }

  useIsomorphicLayoutEffect(() => {
    init()

    return () => {
      rowVirtualizer.clean()
      colVirtualizer.clean()
    }
  }, [rowVirtualizer, colVirtualizer])

  return (
    <ScrollView
      scrollX
      scrollY
      enhanced
      className={className}
      style={{ overflow: 'auto', ...style }}
      id={scrollId}
      onScroll={onScroll}
    >
      <View
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
              <View
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
              </View>
            ))}
          </Fragment>
        ))}
      </View>
    </ScrollView>
  )
}
