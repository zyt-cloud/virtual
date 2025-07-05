import { hasTouch } from '.'
import type { PullToRefresh } from '../pull-to-refresh'
import type { LikeEvent } from '../typings'

type LikeScrollEvent = {
  scrollTop: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export class EventManager<TEvent = TouchEvent | PointerEvent> {
  private refreshInstance?: PullToRefresh
  private pressed = false

  private isTouchEvent(e: Event): e is TouchEvent {
    return e.type.startsWith('touch')
  }

  private formatEvent(e: Event) {
    const event = this.isTouchEvent(e as Event) ? (e as TouchEvent).touches[0] : (e as PointerEvent)
    return { clientX: event?.clientX ?? 0, clientY: event?.clientY ?? 0, type: (e as Event).type }
  }

  // TODO 浏览器 和 小程序平台各自实现该静态方法
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public canMove(_e: Event) {
    return false
  }

  public start(e: TEvent) {
    if (hasTouch && !this.isTouchEvent(e as Event)) {
      return
    }
    this.pressed = true
    const data = this.formatEvent(e as Event)
    this.refreshInstance?.onStart(data as LikeEvent)
  }

  public move(e: TEvent) {
    // pointerEvent 不满足效果
    if ((hasTouch && !this.isTouchEvent(e as Event)) || !this.pressed) {
      return
    }

    const data = this.formatEvent(e as Event)
    if (this.canMove(e as Event)) {
      if ((e as Event).currentTarget instanceof HTMLElement) {
        ;(e as Event).preventDefault()
      }
      this.refreshInstance?.onMove(data as unknown as LikeEvent)
    }
  }

  public end() {
    this.pressed = false
    this.refreshInstance?.onEnd()
  }

  // 小程序端需要
  public scroll(e: LikeScrollEvent) {
    this.refreshInstance?.onScroll(e.scrollTop)
  }

  public getRefreshInstance() {
    return this.refreshInstance
  }

  public setRefreshInstance(instance: PullToRefresh) {
    if (this.refreshInstance !== instance) {
      this.refreshInstance = instance
    }
  }
}
