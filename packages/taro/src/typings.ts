import type { ScrollViewProps } from '@tarojs/components'
import type { MiniVirtualizer, VirtualizerOptions } from '@z-cloud/virtual-mini'
import type { VirtualItem } from '@z-cloud/virtual-mini'

export interface VirtualListProps extends VirtualizerOptions {
  className?: string
  itemClassName?: string
  style?: React.CSSProperties
  itemStyle?: React.CSSProperties
  /**
   * 动态尺寸 grid 模式暂不支持
   */
  dynamicSize?: boolean
  /**
   * girdSize [行尺寸，列尺寸] 提供该值会覆盖 size 配置
   */
  gridSize?: [number, number]
  /**
   * grid 模式
   */
  grid?: boolean
  // 是否跟随页面滚动， 此时不需要设置虚拟列表高度
  followPageScroll?: boolean
  scrollViewProps?: ScrollViewProps
  /**
   * grid布局时接收第二个参数，列的数据
   * @param item
   * @param colItem
   * @returns
   */
  children: (item: VirtualItem, colItem?: VirtualItem) => React.ReactNode
  onReady?: (virtualizer: MiniVirtualizer, colVirtualizer?: MiniVirtualizer) => void
}
