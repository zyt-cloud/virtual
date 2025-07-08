import type { EventManager } from './event'

const hasTouch = Reflect.has(typeof window !== 'undefined' ? window : globalThis, 'ontouchstart')

/**
 * 浏览器端事件绑定
 */
export function bindEvent(target: Element | Window, eventManager: EventManager<any>) {
  const controller = new AbortController()

  const eventOptions = {
    passive: true,
    signal: controller.signal,
  }
  eventManager.local = target instanceof HTMLElement

  // eventManager.canMove = ((target as any).scrollTop ?? window.pageYOffset ?? window.scrollY) === 0

  const onScroll = (e: Event) => {
    const scrollTop = (e.currentTarget as any)?.scrollTop ?? window.pageYOffset ?? window.scrollY
    eventManager.canMove = scrollTop === 0
  }

  target.addEventListener('scroll', onScroll, eventOptions)

  if (hasTouch) {
    target.addEventListener('touchstart', eventManager.start as any, eventOptions)
    target.addEventListener('touchmove', eventManager.move as any, {
      passive: !eventManager.local,
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
