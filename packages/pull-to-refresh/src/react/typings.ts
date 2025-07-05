import type { PullToRefreshOptions } from '../lib/typings'

export interface PullToRefreshProps extends PullToRefreshOptions {
  getScrollElement?: () => HTMLElement | null | undefined
  className?: string
  style?: React.CSSProperties
}
