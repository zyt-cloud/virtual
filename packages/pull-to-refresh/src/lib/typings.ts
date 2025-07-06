import type { PullToRefresh } from './pull-to-refresh'

/**
 * pulling 向下拉 loading 加载中 finished 加载完成 initial 初始状态
 */
export type Status = 'pulling' | 'loading' | 'finished' | 'initial'

export type EventType =
  | 'touchstart'
  | 'touchmove'
  | 'touchend'
  | 'pointerdown'
  | 'pointermove'
  | 'pointerup'

export interface LikeEvent {
  clientX: number
  clientY: number
  type: EventType
  [key: string]: any
}

export interface PullToRefreshOptions {
  /**
   * 刷新阈值 达到该值松手即可刷新
   * @default 50
   */
  refreshThreshold?: number
  /**
   * 最大下拉距离
   * @default 100
   */
  maxPullDistance?: number
  /**
   * 下拉角度,角度大于该值则不触发下拉
   * @default 30
   */
  pullAngle?: number
  /**
   * 加载器大小
   * @default 40
   */
  size?: number
  /**
   * 刷新中回调 返回Promise true则关闭刷新
   * @returns
   */
  onRefresh: () => Promise<boolean>
  onChange?: (instance: PullToRefresh) => void
}
