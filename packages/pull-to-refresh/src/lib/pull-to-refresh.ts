import type { Status, LikeEvent, PullToRefreshOptions } from './typings'
import { getPullAngle } from './utils'

export class PullToRefresh {
  public options!: Required<PullToRefreshOptions>
  // 下拉组件ui状态
  public status: Status = 'initial'
  // 是否可以拖动下拉组件 只有元素或页面滚动到顶部在具备下拉刷新功能
  public ready = true

  public startPos = { x: 0, y: 0 }
  public pullDistance = 0

  constructor(options: PullToRefreshOptions) {
    this.setOptions(options)
    this.pullDistance = -this.options.size
  }

  public setOptions(options: PullToRefreshOptions) {
    Object.entries(options).forEach(([key, value]) => {
      if (typeof value === 'undefined') {
        Reflect.deleteProperty(options, key)
      }
    })

    this.options = {
      refreshThreshold: 50,
      maxPullDistance: 100,
      pullAngle: 30,
      size: 40,
      onChange: () => {},
      ...options,
    }
  }

  // 小程序专用
  public onScroll(scrollTop: number) {
    // or scrollTop === 0
    this.ready = scrollTop < 1

    if (!this.ready && this.status !== 'initial') {
      this.reset()
    }
  }

  public onStart(e: LikeEvent) {
    this.startPos = { x: e.clientX, y: e.clientY }
  }

  public onMove(e: LikeEvent) {
    // 未按下鼠标
    if (!this.ready) {
      return
    }

    const { pullAngle, maxPullDistance } = this.options

    // 下拉角度
    const angle = getPullAngle(e, this.startPos)

    // 左右 pullAngle 范围有效
    if (angle > 90 + pullAngle || angle < 90 - pullAngle) {
      return
    }

    this.status = 'pulling'
    const pullDistance = (e.clientY - this.startPos.y) * 0.4

    this.pullDistance = Math.max(
      pullDistance > maxPullDistance ? this.pullDistance + 0.2 : pullDistance,
      0,
    )

    this.notify()
  }

  public onEnd() {
    if (this.status !== 'pulling') {
      return
    }

    if (this.pullDistance >= this.options.refreshThreshold) {
      this.status = 'loading'
      this.notify()
      this.refresh()
    } else {
      this.reset()
    }
  }

  public async refresh() {
    try {
      const result = await this.options.onRefresh()
      if (result) {
        this.finished()
      }
    } catch {
      this.finished()
    }
  }

  public finished() {
    this.status = 'finished'
    this.notify()
  }

  public reset() {
    this.status = 'initial'
    this.pullDistance = -this.options.size
    this.notify()
  }

  public notify() {
    this.options.onChange(this)
  }
}
