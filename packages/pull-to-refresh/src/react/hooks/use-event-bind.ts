import { useState } from 'react'
import { EventManager } from '../../lib/utils/event'

export function useEventBind(event?: EventManager<React.TouchEvent | React.PointerEvent>) {
  const [eventManager] = useState(
    () => event ?? new EventManager<React.TouchEvent | React.PointerEvent>(),
  )

  if (!event) {
    eventManager.start = eventManager.start.bind(eventManager)
    eventManager.move = eventManager.move.bind(eventManager)
    eventManager.end = eventManager.end.bind(eventManager)
  }

  return eventManager
}
