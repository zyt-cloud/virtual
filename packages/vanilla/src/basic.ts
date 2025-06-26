import type { ScrollAlignment, Range, BasicVirtualizerOptions, VirtualItem, Rect } from './typings'
import { memoFnResult } from './utils'

const defaultGetItemKey = (index: number) => index

const defaultCustomeRange = (range: Range) => {
  const start = Math.max(range.startIndex - range.overscan, 0)
  const end = Math.min(range.endIndex + range.overscan, range.count - 1)

  return Array.from({ length: end - start + 1 }, (_, index) => index + start)
}

/**
 * 虚拟列表基类
 */
export class BasicVirtualizer<TOptions = Record<string, any>> {
  public options!: TOptions & Required<BasicVirtualizerOptions>
  public items: VirtualItem[] = []

  public scrollElementRect?: Rect
  public scrollOffset?: number
  // 是否滚动状态
  public scrolling = false
  public range?: { startIndex: number; endIndex: number }

  public unsubscribes: Array<void | (() => void)> = []
  public dynamicSizeCache = new Map<number, number>()
  public pendingDynamicSizeIndexes: number[] = []

  public setOptions(options: TOptions & BasicVirtualizerOptions) {
    Object.entries(options).forEach(([key, value]) => {
      if (typeof value === 'undefined') {
        Reflect.deleteProperty(options, key)
      }
    })

    this.options = {
      initialOffset: 0,
      overscan: 1,
      paddingStart: 0,
      paddingEnd: 0,
      scrollMargin: 0,
      horizontal: false,
      gap: 0,
      lanes: 1,
      getItemKey: defaultGetItemKey,
      customeRange: defaultCustomeRange,
      onChange: () => {},
      ...options,
    }
  }

  public dynamicMode() {
    return this.dynamicSizeCache.size > 0
  }

  public setScrollElementRect(rect: Rect) {
    this.scrollElementRect = rect
    this.notify()
  }

  /**
   * 获取每条lane的最后一个item 并返回end值最小的那一个
   * @param items
   * @param index
   */
  private getLastItemForLane(items: VirtualItem[], index: number) {
    const lastItems = new Map<number, VirtualItem>()

    for (let i = index - 1; i >= 0; i--) {
      const item = items[i]!
      const previousLastItem = lastItems.get(item.lane)

      if (previousLastItem == null || item.end > previousLastItem.end) {
        lastItems.set(item.lane, item)
      }

      if (lastItems.size === this.options.lanes) {
        break
      }
    }

    if (lastItems.size === this.options.lanes) {
      return [...lastItems.values()].sort((a, b) => {
        if (a.end === b.end) {
          return a.index - b.index
        }
        return a.end - b.end
      })[0]
    }
    return void 0
  }

  /**
   * 所有虚拟项数据
   */
  private geItemsWithtMemo = memoFnResult(
    (count: number, paddingStart: number, scrollMargin: number) => {
      const { getItemKey, lanes, gap, size: configSize } = this.options
      // 性能优化 每次从有尺寸变化的元素开始处理数据
      const startIndex =
        this.pendingDynamicSizeIndexes.length > 0 ? Math.min(...this.pendingDynamicSizeIndexes) : 0
      const nextItems = this.items.slice(0, startIndex)

      this.pendingDynamicSizeIndexes = []

      for (let index = startIndex; index < count; index++) {
        const key = getItemKey(index)
        const lastItem =
          lanes === 1 ? nextItems[index - 1] : this.getLastItemForLane(nextItems, index)

        const start = lastItem ? lastItem.end + gap : paddingStart + scrollMargin

        const dynamicSize = this.dynamicSizeCache.get(index)

        const size =
          dynamicSize ?? (typeof configSize === 'function' ? configSize(index) : configSize)

        const lane = !lastItem ? index % lanes : lastItem.lane

        nextItems[index] = {
          key,
          index,
          start,
          end: start + size,
          size,
          lane,
        }
      }

      return (this.items = nextItems)
    },
  )

  public getItems() {
    return this.geItemsWithtMemo(
      this.options.count,
      this.options.paddingStart,
      this.options.scrollMargin,
    )
  }

  private getVirtualItemsWithMemo = memoFnResult((indexes: number[], items: VirtualItem[]) => {
    return indexes.map((index) => items[index]!)
  })

  public getVirtualItems() {
    const indexes = this.getVirtualIndexes()
    const items = this.getItems()

    return this.getVirtualItemsWithMemo(indexes, items)
  }

  private getVirtualIndexesWithMemo = memoFnResult(
    (count: number, overscan: number, startIndex?: number, endIndex?: number) => {
      if (startIndex === void 0 || endIndex === void 0) {
        return []
      }

      return this.options.customeRange({
        startIndex,
        endIndex,
        overscan,
        count,
      })
    },
  )

  public getVirtualIndexes() {
    const { count, overscan } = this.options
    this.range = this.calculateRangeIndex()

    return this.getVirtualIndexesWithMemo(
      count,
      overscan,
      this.range?.startIndex,
      this.range?.endIndex,
    )
  }

  public getScrollOffset() {
    this.scrollOffset =
      this.scrollOffset ??
      (typeof this.options.initialOffset === 'function'
        ? this.options.initialOffset()
        : this.options.initialOffset)
    return this.scrollOffset
  }

  public getSize() {
    return this.scrollElementRect?.[this.options.horizontal ? 'width' : 'height'] ?? 0
  }

  public getTotalSize() {
    const { lanes, scrollMargin, paddingStart, paddingEnd } = this.options
    const items = this.getItems()
    let end = 0

    if (items.length === 0) {
      end = paddingStart
    } else if (lanes === 1) {
      end = items[items.length - 1]?.end ?? 0
    }
    // 查找每条lane的end值，取其中值最大的的
    else {
      const endLanes = Array<number | null>(lanes).fill(null)
      let endIndex = items.length - 1

      while (endIndex > -1 && endLanes.some((val) => val === null)) {
        const item = items[endIndex]!
        if (endLanes[item.lane] === null) {
          endLanes[item.lane] = item.end
        }
        endIndex--
      }

      // 取最大值
      end = Math.max(...endLanes.filter((val) => val !== null))
    }

    return Math.max(0, end + paddingEnd - scrollMargin)
  }

  public calculateStartIndex(scrollOffset: number) {
    let lowIndex = 0
    let highIndex = this.items.length - 1

    while (lowIndex <= highIndex) {
      const middleIndex = Math.floor((lowIndex + highIndex) / 2)
      const currentOffset = this.items[middleIndex]!.start

      if (currentOffset < scrollOffset) {
        lowIndex = middleIndex + 1
      } else if (currentOffset > scrollOffset) {
        highIndex = middleIndex - 1
      } else {
        return middleIndex
      }
    }

    return lowIndex > 0 ? lowIndex - 1 : 0
  }

  private calculateRangeWithMemo = memoFnResult(
    (lanes: number, scrollElementSize: number, scrollOffset: number, items: VirtualItem[]) => {
      if (items.length === 0 || scrollElementSize === 0) {
        return
      }

      const lastIndex = items.length - 1

      if (items.length <= lanes) {
        return {
          startIndex: 0,
          endIndex: lastIndex,
        }
      }

      let startIndex = this.calculateStartIndex(scrollOffset)
      let endIndex = startIndex

      if (lanes === 1) {
        while (endIndex < lastIndex && items[endIndex]!.end < scrollElementSize + scrollOffset) {
          endIndex++
        }
      } else if (lanes > 1) {
        // 查找结束位置坐标
        const endLanes = Array(lanes).fill(0)
        while (
          endIndex < lastIndex &&
          endLanes.some((end) => end < scrollElementSize + scrollOffset)
        ) {
          const item = items[endIndex]!
          endLanes[item.lane] = item.end
          endIndex++
        }

        startIndex = Math.max(0, startIndex - (startIndex % lanes))
        endIndex = Math.min(lastIndex, endIndex + (lanes - 1 - (endIndex % lanes)))
      }

      return { startIndex, endIndex }
    },
  )

  private calculateRangeIndex() {
    return this.calculateRangeWithMemo(
      this.options.lanes,
      this.getSize(),
      this.getScrollOffset(),
      this.getItems(),
    )
  }

  public getOffsetForAlign(offset: number, align: ScrollAlignment = 'start', itemSize = 0) {
    const size = this.getSize()

    if (align === 'center') {
      offset += (itemSize - size) / 2
    } else if (align === 'end') {
      offset -= size
    }

    const maxScrollOffset = this.getTotalSize() - size
    return Math.max(0, Math.min(maxScrollOffset, offset))
  }

  public getOffsetForIndex(index: number, align: ScrollAlignment = 'start') {
    const item = this.items[index]

    if (!item) {
      return 0
    }

    const offset = align === 'end' ? item.end : item.start

    return this.getOffsetForAlign(offset, align, item.size)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private notifyWithMemo = memoFnResult(
    (scrolling: boolean, _startIndex?: number, _endIndex?: number) => {
      this.options.onChange(scrolling)
    },
  )

  public notify() {
    const range = this.calculateRangeIndex()
    this.notifyWithMemo(this.scrolling, range?.startIndex, range?.endIndex)
  }

  /**
   * 清除指定函数的缓存
   * @param names 需要清除缓存的函数名称
   */
  public clearFnMemo(
    names: (
      | 'notifyWithMemo'
      | 'calculateRangeWithMemo'
      | 'getVirtualItemsWithMemo'
      | 'getVirtualIndexesWithMemo'
      | 'geItemsWithtMemo'
    )[],
  ) {
    names.forEach((name) => {
      this[name].clear()
    })
  }
}
