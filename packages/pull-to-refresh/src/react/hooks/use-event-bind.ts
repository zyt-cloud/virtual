import { useState, useEffect } from 'react'
import { EventManager } from '../../lib/utils/event'
import { bindEvent } from '../../lib/utils/dom'
import { PullToRefreshProps } from '../typings'

export function useEventBind(getScrollElement: PullToRefreshProps['getScrollElement']) {
  const [eventManager] = useState(() => {
    const eventManager = new EventManager<React.TouchEvent | React.PointerEvent>()
    eventManager.start = eventManager.start.bind(eventManager)
    eventManager.move = eventManager.move.bind(eventManager)
    eventManager.end = eventManager.end.bind(eventManager)
    return eventManager
  })

  useEffect(() => {
    const scrollElement = getScrollElement?.() ?? window
    const abort = bindEvent(scrollElement, eventManager)

    return abort
  }, [])

  return eventManager
}
