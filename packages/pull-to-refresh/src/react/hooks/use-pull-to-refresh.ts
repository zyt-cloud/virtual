import { useEffect, useLayoutEffect, useReducer, useState } from 'react'
import type { PullToRefreshOptions } from '../../lib/typings'
import { PullToRefresh } from '../../lib/pull-to-refresh'
import { canUseDom } from '@z-cloud/virtual-vanilla'
import type { PullToRefreshProps } from '../typings'

export const useIsomorphicLayoutEffect = canUseDom ? useLayoutEffect : useEffect

export function usePullToRefresh({ onChange, ...restOptions }: PullToRefreshProps) {
  const rerender = useReducer(() => ({}), {})[1]

  const options: PullToRefreshOptions = {
    ...restOptions,
    onChange: () => {
      rerender()
      onChange?.()
    },
  }

  const [pullToRefresh] = useState(() => new PullToRefresh(options))

  pullToRefresh.setOptions(options)
  return pullToRefresh
}
