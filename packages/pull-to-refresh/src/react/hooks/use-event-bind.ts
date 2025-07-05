import { useState, useEffect, type RefObject } from 'react'
import { EventManager } from '../../lib/utils/event'
import { bindEvent } from '../../lib/utils/dom'
import { type PullToRefresh } from '../../lib/pull-to-refresh'

export function useEventBind(instance: PullToRefresh, domRef?: RefObject<HTMLElement | null>) {
  const [eventManager] = useState(() => {
    const eventManager = new EventManager<React.TouchEvent | React.PointerEvent>()
    eventManager.start = eventManager.start.bind(eventManager)
    eventManager.move = eventManager.move.bind(eventManager)
    eventManager.end = eventManager.end.bind(eventManager)
    eventManager.setRefreshInstance(instance)
    return eventManager
  })

  useEffect(() => {
    const scrollElement = domRef?.current?.offsetParent ?? window
    const abort = bindEvent(scrollElement, eventManager)

    return abort
  }, [])

  return eventManager
}
