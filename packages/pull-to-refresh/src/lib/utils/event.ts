import { hasTouch } from '.'
import type { PullToRefresh } from '../pull-to-refresh'
import type { LikeEvent } from '../typings'

type LikeScrollEvent = {
  scrollTop: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export class EventManager<TEvent = TouchEvent | PointerEvent> {
  private static refreshInstance?: PullToRefresh

  static isTouchEvent(e: Event): e is TouchEvent {
    return e.type.startsWith('touch')
  }

  static formatEvent(e: Event) {
    const event = EventManager.isTouchEvent(e as Event)
      ? (e as TouchEvent).touches[0]
      : (e as PointerEvent)
    return { clientX: event?.clientX ?? 0, clientY: event?.clientY ?? 0, type: (e as Event).type }
  }

  // TODO 浏览器 和 小程序平台各自实现该静态方法
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static canMove(_e: Event) {
    return false
  }

  public start(e: TEvent) {
    if (hasTouch && !EventManager.isTouchEvent(e as Event)) {
      return
    }
    const data = EventManager.formatEvent(e as Event)
    EventManager.refreshInstance?.onStart(data as LikeEvent)
  }

  public move(e: TEvent) {
    if (hasTouch && !EventManager.isTouchEvent(e as Event)) {
      return
    }
    const data = EventManager.formatEvent(e as Event)
    if (EventManager.canMove(e as Event)) {
      EventManager.refreshInstance?.onMove(data as unknown as LikeEvent)
    }
  }

  public end() {
    EventManager.refreshInstance?.onEnd()
  }

  // 小程序端需要
  public scroll(e: LikeScrollEvent) {
    EventManager.refreshInstance?.onScroll(e.scrollTop)
  }

  public getRefreshInstance() {
    return EventManager.refreshInstance
  }

  public setRefreshInstance(instance: PullToRefresh) {
    if (EventManager.refreshInstance !== instance) {
      EventManager.refreshInstance = instance
    }
  }
}
