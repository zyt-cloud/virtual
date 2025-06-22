import { BrowserVirtualizer, getElementOffsetTop, type VirtualizerOptions } from '@z-cloud/virtual-browser'
import type { VirtualListProps, VirtualizerInstance } from '../typings'
import { unref, shallowRef, onScopeDispose, watch, type Ref, triggerRef } from 'vue'

type MayBeRef<T> = T | Ref<T>

export function useVirualizer(props: MayBeRef<VirtualListProps>, containerRef: Ref<HTMLElement | null>) {
  const virtualizerRef = shallowRef<VirtualizerInstance>()

  watch(
    () => unref(props),
    (newProps) => {
      const { onChange, followPageScroll, ...restOptions } = newProps

      const options: VirtualizerOptions<HTMLElement | Window> = {
        getScrollElement: () => (followPageScroll ? window : containerRef.value),
        scrollMargin: followPageScroll ? getElementOffsetTop(containerRef.value) : 0,
        ...restOptions,
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
