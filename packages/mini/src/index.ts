import {
  BasicVirtualizer,
  debounce,
  type Key,
  type Rect,
  type ScrollToOptions,
  type VirtualItem,
} from '@z-cloud/virtual-vanilla'
import type { VirtualizerOptions, ScrollOption } from './typings'

export type { VirtualizerOptions, VirtualItem }

export class MiniVirtualizer extends BasicVirtualizer {
  private scrollToIndexTimeoutId: any | null = null

  private dynamicElementsCache = new Map<Key, any>()
  constructor(options: VirtualizerOptions) {
    super()
    this.setOptions(options)
  }

  init() {
    // 统一各平台的使用方式
    this.scrollToOffset(
      typeof this.options.initialOffset === 'function'
        ? this.options.initialOffset()
        : this.options.initialOffset,
    )
    this.notify()
  }

  public onElementSizeChange(index: number, rect: Rect) {
    const item = this.items[index]
    const size = rect[this.options.horizontal ? 'width' : 'height']

    if (!item) {
      return
    }

    const delta = size - item.size

    // 忽略小于1的微小变化
    if (Math.abs(delta) >= 1) {
      const offset = this.getScrollOffset()

      if (item.start < offset) {
        this.scrollTo(offset + delta)
      }

      this.dynamicSizeCache.set(index, size)
      this.pendingDynamicSizeIndexes.push(index)
      this.scrolling = false
      // 尺寸变化清空函数 geItemsWithtMemo 的缓存 使其下次调用重新计算
      this.clearFnMemo(['geItemsWithtMemo', 'notifyWithMemo'])
      this.notify()
    }
  }

  private resetScrolling = debounce(() => {
    this.scrolling = false
    this.notify()
  }, 160)

  public onScroll(res: ScrollOption) {
    if (!res) {
      return
    }

    const offset = res[this.options.horizontal ? 'scrollLeft' : 'scrollTop'] ?? 0

    // 减少一定频率
    if (typeof this.scrollOffset !== 'undefined' && Math.abs(this.scrollOffset - offset) < 5) {
      this.scrollOffset = offset
      return
    }

    this.scrollOffset = offset
    this.scrolling = true
    this.resetScrolling({ clearTimeout, setTimeout } as any)
    this.notify()
  }

  public scrollTo(_offset: number, _behavior: ScrollBehavior = 'instant') {
    console.warn('scrollTo 需要针对 uni-app 或者 taro 各自实现')
  }

  public scrollToOffset(offset: number, behavior?: ScrollBehavior) {
    this.cancelScrollToIndex()
    this.scrollTo(offset, behavior)
  }

  private cancelScrollToIndex() {
    if (this.scrollToIndexTimeoutId !== null) {
      clearTimeout(this.scrollToIndexTimeoutId)
      this.scrollToIndexTimeoutId = null
    }
  }
  public scrollToIndex(index: number, { align, behavior }: ScrollToOptions = {}) {
    this.cancelScrollToIndex()
    const safeIndex = Math.max(0, Math.min(index, this.options.count - 1))
    const offset = this.getOffsetForIndex(safeIndex, align)

    if (!offset) {
      return
    }

    // 动态尺寸模式滚动不使用 smooth 模式
    this.scrollTo(offset, this.dynamicMode() ? 'instant' : behavior)

    if (this.dynamicMode()) {
      this.scrollToIndexTimeoutId = setTimeout(() => {
        this.scrollToIndexTimeoutId = null

        if (this.dynamicElementsCache.has(this.options.getItemKey(safeIndex))) {
          const calcOffset = this.getOffsetForIndex(safeIndex, align)
          if (!calcOffset) {
            return
          }

          const currentScrollOffset = this.getScrollOffset()
          // 滚动修正
          if (Math.abs(calcOffset - currentScrollOffset) > 1) {
            this.scrollToIndex(safeIndex, { align, behavior: 'instant' })
          }
        } else {
          this.scrollToIndex(safeIndex, { align, behavior: 'instant' })
        }
      })
    }
  }

  public clean() {
    this.unsubscribes = this.unsubscribes.filter((unsub) => {
      if (typeof unsub === 'function') {
        unsub()
      }
      return false
    })

    this.dynamicSizeCache.clear()
    this.pendingDynamicSizeIndexes = []
  }
}
