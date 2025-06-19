import { BasicVirtualizer, debounce } from '@z-cloud/virtual-vanilla';
import type { Key, Rect, ScrollToOptions } from '@z-cloud/virtual-vanilla';
import type { VirtualizerOptions } from './typings';

export type { VirtualizerOptions };

const eventListenerOptions = {
  passive: true,
};

const getScrollElementRect = (element: HTMLElement | Window): Rect => {
  const isElement = element instanceof HTMLElement;
  const width = isElement ? element.offsetWidth : element.innerWidth;
  const height = isElement ? element.offsetHeight : element.innerHeight;

  return { width, height };
};

/**
 * 适用于浏览器环境
 */
export class BrowserVirtualizer<
  TScrollElement extends HTMLElement | Window = any,
  TItemElement extends HTMLElement = any,
> extends BasicVirtualizer<VirtualizerOptions<TScrollElement>> {
  public scrollElement: TScrollElement | null = null;
  targetWindow: Window | null = null;

  private elementObserver: ResizeObserver | null = null;
  private dynamicElementsCache = new Map<Key, TItemElement>();

  private scrollToIndexTimeoutId: number | null = null;

  constructor(options: VirtualizerOptions<TScrollElement>) {
    super();
    this.setOptions(options);
  }

  public init() {
    const scrollElement = this.options.getScrollElement();

    if (!scrollElement || this.scrollElement === scrollElement) {
      return;
    }

    this.scrollElement = scrollElement;

    if (this.scrollElement instanceof HTMLElement) {
      this.targetWindow = this.scrollElement.ownerDocument.defaultView;
      // 监听滚动元素尺寸变化
      this.unsubscribes.push(this.observeElementRect());
    } else {
      this.targetWindow = this.scrollElement.window;
      // 监听窗口尺寸变化
      this.unsubscribes.push(this.observeWindowRect());
    }
    // 注册滚动事件监听
    this.unsubscribes.push(this.addScrollEventListener());

    this.initElementObserver();

    this.scrollToOffset(
      typeof this.options.initialOffset === 'function'
        ? this.options.initialOffset()
        : this.options.initialOffset,
    );
    this.notify();
  }

  private observeElementRect() {
    const scrollElement = this.scrollElement as HTMLElement;
    const targetWindow = this.targetWindow;

    if (!targetWindow || !globalThis.ResizeObserver) {
      return;
    }

    this.setScrollElementRect(getScrollElementRect(scrollElement));

    const observe = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const boxSize = entry.borderBoxSize?.[0];
        if (boxSize) {
          this.setScrollElementRect({
            width: boxSize.inlineSize,
            height: boxSize.blockSize,
          });
          return;
        }
      }
      this.setScrollElementRect(getScrollElementRect(scrollElement));
    });

    observe.observe(scrollElement, { box: 'border-box' });

    return () => {
      observe.unobserve(scrollElement);
    };
  }

  private observeWindowRect() {
    const targetWindow = this.targetWindow;

    if (!targetWindow) {
      return;
    }

    const handleResize = () => {
      this.setScrollElementRect(getScrollElementRect(targetWindow));
    };

    handleResize();

    targetWindow.addEventListener('resize', handleResize);

    return () => {
      targetWindow.removeEventListener('resize', handleResize);
    };
  }

  private initElementObserver() {
    if (!this.targetWindow || !globalThis.ResizeObserver) {
      return;
    }

    this.elementObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const boxSize = entry.borderBoxSize?.[0];
        if (boxSize) {
          this.handleElementSizeChange(
            entry.target as TItemElement,
            boxSize[this.options.horizontal ? 'inlineSize' : 'blockSize'],
          );
        }
      }
    });
  }

  private resizeItemSize(index: number, size: number) {
    const item = this.items[index];

    if (!item) {
      return;
    }

    const delta = size - item.size;

    // 忽略小于1的微小变化
    if (Math.abs(delta) >= 1) {
      const offset = this.getScrollOffset();

      if (item.start < offset) {
        this.scrollTo(offset + delta);
      }

      this.dynamicSizeCache.set(index, size);
      this.pendingDynamicSizeIndexes.push(index);
      this.scrolling = false;
      // 尺寸变化清空函数 geItemsWithtMemo 的缓存 使其下次调用重新计算
      this.clearFnMemo(['geItemsWithtMemo']);
      this.notify();
    }
  }

  private handleElementSizeChange(element: TItemElement, size: number) {
    const index = Number.parseInt(element.dataset.index ?? '-1', 10);
    const item = this.getItems()[index];

    if (!item) {
      return;
    }

    const key = item.key;
    const prevElement = this.dynamicElementsCache.get(key);

    if (prevElement !== element) {
      if (prevElement) {
        this.elementObserver?.unobserve(prevElement);
      }
      this.elementObserver?.observe(element, { box: 'border-box' });
      this.dynamicElementsCache.set(item.key, element);
    }

    if (element.isConnected) {
      this.resizeItemSize(index, size);
    }
  }

  public elementMounted = (element?: TItemElement | null) => {
    if (!element) {
      this.dynamicElementsCache.forEach((ele, key) => {
        if (!ele.isConnected) {
          this.elementObserver?.unobserve(ele);
          this.dynamicElementsCache.delete(key);
        }
      });
      return;
    }

    this.handleElementSizeChange(
      element,
      this.options.horizontal ? element.offsetWidth : element.offsetHeight,
    );
  };

  private resetScolling = debounce(() => {
    this.scrolling = false;
    this.notify();
  }, 160);

  /**
   * 添加滚动监听
   */
  private addScrollEventListener() {
    const scrollElement = this.scrollElement;

    if (!this.targetWindow || !scrollElement) {
      return;
    }

    const scrollHandler = () => {
      let offset = 0;
      const { horizontal } = this.options;
      if (scrollElement instanceof HTMLElement) {
        offset = horizontal
          ? scrollElement['scrollLeft']
          : scrollElement['scrollTop'];
      } else {
        offset = horizontal ? scrollElement.scrollX : scrollElement.scrollY;
      }

      this.scrollOffset = offset;
      this.scrolling = true;
      this.resetScolling(this.targetWindow!);
      this.notify();
    };

    scrollElement.addEventListener(
      'scroll',
      scrollHandler,
      eventListenerOptions,
    );

    return () => {
      scrollElement.removeEventListener('scroll', scrollHandler);
    };
  }

  private scrollTo(offset: number, behavior: ScrollBehavior = 'instant') {
    this.scrollElement?.scrollTo({
      [this.options.horizontal ? 'left' : 'top']: offset,
      behavior,
    });
  }

  public scrollToOffset(offset: number, behavior?: ScrollBehavior) {
    this.cancelScrollToIndex();
    this.scrollTo(offset, behavior);
  }

  private cancelScrollToIndex() {
    if (this.scrollToIndexTimeoutId !== null) {
      this.targetWindow?.clearTimeout(this.scrollToIndexTimeoutId);
      this.scrollToIndexTimeoutId = null;
    }
  }
  public scrollToIndex(
    index: number,
    { align, behavior }: ScrollToOptions = {},
  ) {
    this.cancelScrollToIndex();
    const safeIndex = Math.max(0, Math.min(index, this.options.count - 1));
    const offset = this.getOffsetForIndex(safeIndex, align);

    if (!offset) {
      return;
    }

    // 动态尺寸模式滚动不使用 smooth 模式
    this.scrollTo(offset, this.dynamicMode() ? 'instant' : behavior);

    if (this.dynamicMode() && this.targetWindow) {
      this.scrollToIndexTimeoutId = this.targetWindow.setTimeout(() => {
        this.scrollToIndexTimeoutId = null;

        if (this.dynamicElementsCache.has(this.options.getItemKey(safeIndex))) {
          const calcOffset = this.getOffsetForIndex(safeIndex, align);
          if (!calcOffset) {
            return;
          }

          const currentScrollOffset = this.getScrollOffset();
          // 滚动修正
          if (Math.abs(calcOffset - currentScrollOffset) > 1) {
            this.scrollToIndex(safeIndex, { align, behavior: 'instant' });
          }
        } else {
          this.scrollToIndex(safeIndex, { align, behavior: 'instant' });
        }
      });
    }
  }

  public clean() {
    this.unsubscribes = this.unsubscribes.filter((unsub) => {
      if (typeof unsub === 'function') {
        unsub();
      }
      return false;
    });
    this.elementObserver?.disconnect();
    this.elementObserver = null;
    this.dynamicSizeCache.clear();
    this.pendingDynamicSizeIndexes = [];
    this.scrollElement = null;
    this.targetWindow = null;
  }
}
