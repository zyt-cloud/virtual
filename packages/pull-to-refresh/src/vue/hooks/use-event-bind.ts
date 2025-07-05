import { EventManager } from '../../lib/utils/event'
import { bindEvent } from '../../lib/utils/dom'
import { type PullToRefresh } from '../../lib/pull-to-refresh'
import { onMounted, onScopeDispose, type Ref } from 'vue'

export function useEventBind(instance: PullToRefresh, domRef?: Ref<HTMLElement | null>) {
  const eventManager = new EventManager<React.TouchEvent | React.PointerEvent>()

  eventManager.start = eventManager.start.bind(eventManager)
  eventManager.move = eventManager.move.bind(eventManager)
  eventManager.end = eventManager.end.bind(eventManager)
  eventManager.setRefreshInstance(instance)

  let abort: () => void

  onMounted(() => {
    const scrollElement = domRef?.value?.offsetParent ?? window
    abort = bindEvent(scrollElement, eventManager)
  })

  onScopeDispose(() => abort?.())

  return eventManager
}
