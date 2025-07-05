import type { PullToRefreshOptions } from '../lib/typings'

export interface PullToRefreshProps extends PullToRefreshOptions {
  /**
   * 局部滚动
   * @default false
   */
  local?: boolean
  className?: string
  style?: React.CSSProperties
}
