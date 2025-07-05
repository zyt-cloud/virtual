import { PullToRefresh } from '../../lib/pull-to-refresh'
import type { PullToRefreshProps } from '../typings'
import { unref, watch, shallowRef, type MaybeRef, triggerRef } from 'vue'

export function usePullToRefresh(props: MaybeRef<PullToRefreshProps>) {
  const instance = shallowRef(new PullToRefresh({ ...unref(props) }))

  watch(
    () => unref(props),
    (nextProps) => {
      instance.value.setOptions({
        ...nextProps,
        onChange: (ins) => {
          triggerRef(instance)
          nextProps.onChange?.(ins)
        },
      })
    },
    { immediate: true },
  )

  return instance
}
