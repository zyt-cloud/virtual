import { BrowserVirtualizer, getElementOffsetTop, type VirtualizerOptions } from '@z-cloud/virtual-browser'
import type { VirtualListProps, VirtualizerInstance } from '../typings'
import { unref, shallowRef, onScopeDispose, watch, type Ref, triggerRef } from 'vue'

type MayBeRef<T> = T | Ref<T>

export function useVirualizer(props: MayBeRef<VirtualListProps>, containerRef: Ref<HTMLElement | null>) {
  const virtualizerRef = shallowRef<VirtualizerInstance>()

  watch(
    [() => unref(props), containerRef],
    ([newProps, container]) => {
      const { onChange, followPageScroll, scrollMargin, ...restOptions } = newProps

      const options: VirtualizerOptions<HTMLElement | Window> = {
        getScrollElement: () => (followPageScroll ? window : containerRef.value),
        ...restOptions,
        scrollMargin: scrollMargin ?? (followPageScroll ? getElementOffsetTop(container) : 0),
        onChange: (scrolling) => {
          triggerRef(virtualizerRef)
          onChange?.(scrolling)
        },
      }

      if (!virtualizerRef.value) {
        virtualizerRef.value = new BrowserVirtualizer(options)
      }

      virtualizerRef.value.setOptions(options)
      triggerRef(virtualizerRef)
    },
    { immediate: true },
  )

  onScopeDispose(() => virtualizerRef.value?.clean())

  return virtualizerRef
}
