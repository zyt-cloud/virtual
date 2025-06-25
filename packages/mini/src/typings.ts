export type Key = string | number | bigint

export interface Range {
  startIndex: number
  endIndex: number
  overscan: number
  count: number
}

export interface Rect {
  width: number
  height: number
}

export interface VirtualItem {
  key: Key
  index: number
  start: number
  end: number
  size: number
  lane: number
}

export type ScrollBehavior = 'auto' | 'smooth' | 'instant'

export type ScrollAlignment = 'start' | 'center' | 'end'

export interface ScrollToOptions {
  align?: ScrollAlignment
  behavior?: ScrollBehavior
}

export interface BasicVirtualizerOptions {
  /**
   * 列表项数量
   */
  count: number
  /**
   * 每一项的大小，竖向滚动为高度，横向滚动为宽度
   */
  size: number | ((index: number) => number)
  /**
   * 可见范围外两端渲染数量，该值越大出现白屏的概率越小。建议跟随页面滚动的虚拟列表该值可稍微配置大一些。
   * @default 1
   */
  overscan?: number
  /**
   * 水平滚动
   * @default false
   */
  horizontal?: boolean
  /**
   * 每项之间的间距
   * @default 0
   */
  gap?: number
  /**
   * 应用于虚拟列表起始位置的padding
   */
  paddingStart?: number
  /**
   * 应用于虚拟列表末尾位置的padding
   */
  paddingEnd?: number
  /**
   * 初始滚动位置
   */
  initialOffset?: number | (() => number)
  /**
   * 滚动元素距离页面顶部的距离
   */
  scrollMargin?: number
  /**
   * 列表被分成的列数或行数 (垂直列表对应列数，水平列表对应行数)
   * @default 1
   */
  lanes?: number
  /**
   * 自定义每一项的 Key 值， 如React中的key
   * @param index 当前项的索引
   * @returns
   */
  getItemKey?: (index: number) => Key
  /**
   * 自定义截取范围
   * @param range
   * @returns
   */
  customeRange?: (range: Range) => number[]
  /**
   * 元素滚动 尺寸变化等时调用
   * @param scrolling 是否滚动中
   * @returns
   */
  onChange?: (scrolling: boolean) => void
}
