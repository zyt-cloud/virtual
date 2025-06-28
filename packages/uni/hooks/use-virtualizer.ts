import { MiniVirtualizer, type VirtualizerOptions } from '@z-cloud/virtual-mini'
import type { VirtualListProps, VirtualizerInstance } from '../typings'
import { unref, shallowRef, onScopeDispose, watch, type MaybeRef, triggerRef } from 'vue'

export function useVirualizer(props: MaybeRef<VirtualListProps>) {
  const virtualizerRef = shallowRef<VirtualizerInstance>()

  watch(
    () => unref(props),
    (newProps) => {
      const { onChange, followPageScroll, scrollMargin, ...restOptions } = newProps

      const options: VirtualizerOptions = {
        ...restOptions,
        scrollMargin: scrollMargin ?? 0,
        onChange: (scrolling) => {
          triggerRef(virtualizerRef)
          onChange?.(scrolling)
        },
      }

      if (!virtualizerRef.value) {
        virtualizerRef.value = new MiniVirtualizer(options)
      }

      virtualizerRef.value.setOptions(options)
      triggerRef(virtualizerRef)
    },
    { immediate: true }
  )

  onScopeDispose(() => virtualizerRef.value?.clean())

  return virtualizerRef
}
