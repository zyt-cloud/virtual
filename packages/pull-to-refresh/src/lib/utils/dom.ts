import { hasTouch } from '.'
import type { EventManager } from './event'

export function bindEvent(target: Element | Window, eventManager: EventManager<any>) {
  const controller = new AbortController()

  const eventOptions = {
    passive: true,
    signal: controller.signal,
  }
  const isElement = target instanceof HTMLElement

  eventManager.canMove = () => {
    if (isElement) {
      return target.scrollTop === 0
    }
    return (window.pageYOffset ?? window.scrollY) === 0
  }

  if (hasTouch) {
    target.addEventListener('touchstart', eventManager.start as any, eventOptions)
    target.addEventListener('touchmove', eventManager.move as any, {
      passive: !isElement,
      signal: controller.signal,
    })
    target.addEventListener('touchend', eventManager.end, eventOptions)
  } else {
    target.addEventListener('pointerdown', eventManager.start as any, eventOptions)
    target.addEventListener('pointermove', eventManager.move as any, eventOptions)
    target.addEventListener('pointerup', eventManager.end, eventOptions)
  }

  return () => controller.abort()
}
