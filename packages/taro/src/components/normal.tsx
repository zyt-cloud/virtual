import { VirtualListProps } from '../typings'
import { useIsomorphicLayoutEffect, useVirualizer } from '../hooks/use-virtualizer'
import { ScrollView, ScrollViewProps, View } from '@tarojs/components'
import {
  getRectSizeAsync,
  getScrollViewContextNode,
  getWindowRect,
  virtualizerUUID,
} from '../utils'
import Taro, { usePageScroll } from '@tarojs/taro'
import { Resizable } from './resizable'
import { useState } from 'react'

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
  scrollViewProps,
  onReady,
  ...props
}: VirtualListProps) {
  const [scrollId] = useState(() => `zcloud-virtual-list-${virtualizerUUID.value++}`)
  const virtualizer = useVirualizer(props)

  const { lanes = 1, horizontal } = props
  const totalSize = virtualizer.getTotalSize()

  let gridTemplateAreas = Array.from({ length: lanes }, (_, index) =>
    horizontal ? `"lane${index}"` : `lane${index}`
  ).join(' ')

  if (!horizontal) {
    gridTemplateAreas = `"${gridTemplateAreas}"`
  }

  usePageScroll((e) => {
    virtualizer.onScroll(e)
  })

  const onScroll: ScrollViewProps['onScroll'] = (e) => {
    virtualizer.onScroll(e.detail)
    scrollViewProps?.onScroll?.(e)
  }

  const init = async () => {
    const windowRect = getWindowRect()
    const elementRect = await getRectSizeAsync(scrollId)
    const scrollNode: any = await getScrollViewContextNode(scrollId)

    virtualizer!.setScrollElementRect(props.followPageScroll ? windowRect : elementRect)

    virtualizer.scrollTo = (offset, behavior) => {
      if (!scrollNode) {
        console.warn('获取scrollNode失败')
        return
      }

      scrollNode.scrollTo({
        [props.horizontal ? 'left' : 'top']: offset,
        animated: dynamicSize ? false : behavior === 'smooth',
      })
    }

    if (props.followPageScroll) {
      virtualizer.options.scrollMargin = elementRect.top ?? 0
      virtualizer.scrollTo = (offset, behavior) => {
        Taro.pageScrollTo({
          scrollTop: offset,
          // 动态尺寸不支持滚动动画 小程序都不建议使用动画
          duration: behavior === 'smooth' && !dynamicSize ? 300 : 0,
        })
      }
    }

    virtualizer.init()

    onReady?.(virtualizer)
  }

  useIsomorphicLayoutEffect(() => {
    init()
    return () => virtualizer.clean()
  }, [virtualizer])

  return (
    <ScrollView
      {...scrollViewProps}
      scrollX={horizontal}
      scrollY={!horizontal}
      enhanced
      className={className}
      style={{ overflow: 'auto', ...style }}
      id={scrollId}
      onScroll={onScroll}
    >
      <View
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
          <View
            key={virtualItem.index}
            className={itemClassName}
            data-index={virtualItem.index}
            style={{
              ...itemStyle,
              gridArea: `lane${virtualItem.lane}`,
              height: horizontal || dynamicSize ? void 0 : virtualItem.size,
              width: !horizontal || dynamicSize ? void 0 : virtualItem.size,
              transform: props.horizontal
                ? `translateX(${virtualItem.start}px)`
                : `translateY(${
                    virtualItem.start -
                    (props.followPageScroll ? virtualizer.options.scrollMargin ?? 0 : 0)
                  }px)`,
            }}
          >
            {dynamicSize && (
              <Resizable
                emitWhenMounted
                listId={`${scrollId}-${virtualItem.index}`}
                style={{ width: '100%' }}
                onResize={(res) =>
                  virtualizer.onElementSizeChange(virtualItem.index, {
                    width: res.width,
                    height: res.height,
                  })
                }
              >
                {children(virtualItem)}
              </Resizable>
            )}
            {!dynamicSize && children(virtualItem)}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
