import { useState } from 'react'
import { EventManager } from '../../lib/utils/event'

export function useEventBind() {
  const [event] = useState(() => new EventManager<React.TouchEvent | React.PointerEvent>())

  return event
}
