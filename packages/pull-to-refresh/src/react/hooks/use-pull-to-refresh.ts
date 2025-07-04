import { useEffect, useLayoutEffect, useReducer, useState } from 'react'
import type { PullToRefreshOptions } from '../../lib/typings'
import { PullToRefresh } from '../../lib/pull-to-refresh'
import { canUseDom } from '@z-cloud/virtual-vanilla'
import type { PullToRefreshProps } from '../typings'
import { hasTouch } from '../../lib/utils'
import { useEventBind } from './use-event-bind'

export const useIsomorphicLayoutEffect = canUseDom ? useLayoutEffect : useEffect

const eventOptions = {
  passive: true,
}

export function usePullToRefresh({ onChange, event, ...restOptions }: PullToRefreshProps) {
  const rerender = useReducer(() => ({}), {})[1]

  const options: PullToRefreshOptions = {
    ...restOptions,
    onChange: () => {
      rerender()
      onChange?.()
    },
  }
  const eventManager = useEventBind(event)
  const [pullToRefresh] = useState(() => new PullToRefresh(options))

  pullToRefresh.setOptions(options)
  eventManager.setRefreshInstance(pullToRefresh)

  useIsomorphicLayoutEffect(() => {
    eventManager.canMove = (e: Event) => {
      if (e.currentTarget instanceof HTMLElement) {
        return e.currentTarget.scrollTop < 1
      }
      return (window.pageYOffset ?? window.scrollY) < 1
    }

    if (!event) {
      if (hasTouch) {
        window.addEventListener('touchstart', eventManager.start as any, eventOptions)
        window.addEventListener('touchmove', eventManager.move as any, eventOptions)
        window.addEventListener('touchend', eventManager.end, eventOptions)
      } else {
        window.addEventListener('pointerdown', eventManager.start as any, eventOptions)
        window.addEventListener('pointermove', eventManager.move as any)
        window.addEventListener('pointerup', eventManager.end, eventOptions)
      }
    }

    return () => {
      if (!event) {
        if (hasTouch) {
          window.removeEventListener('touchstart', eventManager.start as any)
          window.removeEventListener('touchmove', eventManager.move as any)
          window.removeEventListener('touchend', eventManager.end)
        } else {
          window.removeEventListener('pointerdown', eventManager.start as any)
          window.removeEventListener('pointermove', eventManager.move as any)
          window.removeEventListener('pointerup', eventManager.end)
        }
      }
    }
  }, [])

  return pullToRefresh
}
