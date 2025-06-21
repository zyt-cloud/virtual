import {
  BrowserVirtualizer,
  getElementOffsetTop,
  type VirtualizerOptions,
} from '@z-cloud/virtual-browser';
import type { VirtualListProps } from '../components/virtual-list.vue';
import { onMounted, onScopeDispose, unref, type Ref } from 'vue';

type MayBeRef<T> = T | Ref<T>;

type VirtualizerInstance = BrowserVirtualizer<
  HTMLElement | Window,
  HTMLElement
>;

export function useVirualizer(
  props: MayBeRef<Omit<VirtualListProps, 'children'>>,
  containerRef: Ref<HTMLElement | null>,
) {
  const { onReady, onChange, followPageScroll, ...restOptions } = unref(props);

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

  const emit = defineEmits<{
    (e: 'change', scrolling: boolean): void;
    (
      e: 'ready',
      virtualizer: VirtualizerInstance,
      colVirtualizer?: VirtualizerInstance,
    ): void;
  }>();

  const virtualizer = new BrowserVirtualizer(options);

  onMounted(() => {
    virtualizer.init();
    emit('ready', virtualizer);
  });

  onScopeDispose(() => virtualizer.clean());

  return virtualizer;
}
