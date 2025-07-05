import type { PullToRefreshProps as CommProps } from '../react/typings'

export type PullToRefreshProps = Omit<CommProps, 'className' | 'style'>
