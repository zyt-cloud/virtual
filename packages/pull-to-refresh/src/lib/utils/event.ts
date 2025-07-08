import type { PullToRefresh } from '../pull-to-refresh'
import type { LikeEvent } from '../typings'

export class EventManager<TEvent = TouchEvent | PointerEvent> {
  private refreshInstance?: PullToRefresh
  private pressed = false
  private startY = 0
  // 是否局部滚动
  public local = false
  private eventType?: 'touch' | 'pointer'
  // TODO 浏览器 和 小程序平台各自处理该属性
  public canMove = true

  private formatEvent(e: Event) {
    const event = this.eventType === 'touch' ? (e as TouchEvent).touches[0] : (e as PointerEvent)
    return { clientX: event?.clientX ?? 0, clientY: event?.clientY ?? 0, type: (e as Event).type }
  }

  public start(e: TEvent) {
    const event = e as Event
    const currentType = event.type.startsWith('touch') ? 'touch' : 'pointer'

    // 如果同时存在 touch 和 pointer Event，则优先使用 touchEvent
    if (this.eventType === 'touch' && currentType !== 'touch') {
      return
    }

    this.eventType = currentType
    this.pressed = true

    const data = this.formatEvent(event)
    this.startY = data.clientY
    this.refreshInstance?.onStart(data as LikeEvent)
  }

  public move(e: TEvent) {
    const event = e as Event

    if (!event.type.startsWith(this.eventType ?? ' ') || !this.pressed) {
      return
    }

    const data = this.formatEvent(event)

    if (this.canMove) {
      if (this.local && this.startY < data.clientY && this.eventType === 'touch') {
        event.preventDefault()
      }
      this.refreshInstance?.onMove(data as unknown as LikeEvent)
    }
  }

  public end() {
    this.pressed = false
    this.refreshInstance?.onEnd()
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
