import { hasTouch } from '.'
import type { EventManager } from './event'

export function bindEvent(target: HTMLElement | Window, eventManager: EventManager<any>) {
  const controller = new AbortController()

  const eventOptions = {
    passive: true,
    signal: controller.signal,
  }
  const isElement = target instanceof HTMLElement

  if (isElement) {
    const position = getComputedStyle(target).getPropertyValue('position')
    if (!['fixed', 'absolute', 'relative'].includes(position)) {
      target.style.position = 'relative'
    }
  }

  eventManager.canMove = () => {
    if (isElement) {
      return target.scrollTop < 1
    }
    return (window.pageYOffset ?? window.scrollY) < 1
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
