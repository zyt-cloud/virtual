import type { MiniVirtualizer, VirtualizerOptions } from '@z-cloud/virtual-mini'
import type { CSSProperties } from 'vue'

export type VirtualizerInstance = MiniVirtualizer

export interface VirtualListProps extends VirtualizerOptions {
  className?: string
  styles?: CSSProperties
  width?: number | string
  height?: number | string
  itemClassName?: string
  itemStyle?: CSSProperties
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
  onReady?: (virtualizer: VirtualizerInstance, colVirtualizer?: VirtualizerInstance) => void
}
