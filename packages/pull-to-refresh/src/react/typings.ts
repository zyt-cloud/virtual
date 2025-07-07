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

export interface LoadMoreProps {
  loading?: boolean
  loadingText?: React.ReactNode
  finished?: React.ReactNode
  error?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}
