import { useEffect, useLayoutEffect, useReducer, useState } from 'react'
import type { PullToRefreshOptions } from '../../lib/typings'
import { PullToRefresh } from '../../lib/pull-to-refresh'
import { canUseDom } from '@z-cloud/virtual-vanilla'
import type { PullToRefreshProps } from '../typings'
import { EventManager } from '../../lib/utils/event'
import { hasTouch } from '../../lib/utils'

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
  const [eventManager] = useState(
    () =>
      (event as unknown as EventManager<TouchEvent | PointerEvent>) ??
      new EventManager<TouchEvent | PointerEvent>()
  )
  const [pullToRefresh] = useState(() => new PullToRefresh(options))

  pullToRefresh.setOptions(options)
  eventManager.setRefreshInstance(pullToRefresh)

  useIsomorphicLayoutEffect(() => {
    EventManager.canMove = (e: Event) => {
      if (e.currentTarget instanceof HTMLElement) {
        return e.currentTarget.scrollTop < 1
      }
      return (window.pageYOffset ?? window.scrollY) < 1
    }

    if (!event) {
      if (hasTouch) {
        window.addEventListener('touchstart', eventManager.start, eventOptions)
        window.addEventListener('touchmove', eventManager.move, eventOptions)
        window.addEventListener('touchend', eventManager.end, eventOptions)
      } else {
        document.body.addEventListener('pointerdown', eventManager.start, eventOptions)
        document.body.addEventListener('pointermove', eventManager.move, eventOptions)
        document.body.addEventListener('pointerup', eventManager.end, eventOptions)
      }
    }

    return () => {
      if (!event) {
        if (hasTouch) {
          window.removeEventListener('touchstart', eventManager.start)
          window.removeEventListener('touchmove', eventManager.move)
          window.removeEventListener('touchend', eventManager.end)
        } else {
          window.removeEventListener('pointerdown', eventManager.start)
          window.removeEventListener('pointermove', eventManager.move)
          window.removeEventListener('pointerup', eventManager.end)
        }
      }
    }
  }, [])

  return pullToRefresh
}
