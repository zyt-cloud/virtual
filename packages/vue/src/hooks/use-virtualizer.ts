import {
  BrowserVirtualizer,
  getElementOffsetTop,
  type VirtualizerOptions,
} from '@z-cloud/virtual-browser';
import type { VirtualListProps, VirtualizerInstance } from '../typings';
import { unref, shallowRef, type Ref } from 'vue';

type MayBeRef<T> = T | Ref<T>;

export function useVirualizer(
  props: MayBeRef<Omit<VirtualListProps, 'children'>>,
  containerRef: Ref<HTMLElement | null>,
) {
  const { onChange, followPageScroll, ...restOptions } = unref(props);

  const options: VirtualizerOptions<HTMLElement | Window> = {
    getScrollElement: () => (followPageScroll ? window : containerRef.value),
    scrollMargin: followPageScroll
      ? getElementOffsetTop(containerRef.value)
      : 0,
    ...restOptions,
    onChange: (scrolling) => {
      onChange?.(scrolling);
    },
  };

  const virtualizer: VirtualizerInstance = new BrowserVirtualizer(options);
  const virtualizerRef = shallowRef(virtualizer);

  return virtualizerRef;
}
