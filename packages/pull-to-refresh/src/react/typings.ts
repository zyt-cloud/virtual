import type { PullToRefreshOptions } from '../lib/typings'
import type { EventManager } from '../lib/utils/event'

export interface PullToRefreshProps extends PullToRefreshOptions {
  className?: string
  style?: React.CSSProperties
  event?: EventManager<React.TouchEvent | React.PointerEvent>
}
