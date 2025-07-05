<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { usePullToRefresh } from './hooks/use-pull-to-refresh'
import { PullToRefreshProps } from './typings'
import { useEventBind } from './hooks/use-event-bind'

const props = withDefaults(defineProps<PullToRefreshProps>(), {
  local: false,
})

const refreshDomRef = ref<HTMLElement | null>(null)

const instance = usePullToRefresh(props)
useEventBind(instance.value, props.local ? refreshDomRef : void 0)

const arcProgress = Math.min(
  Math.max(0, instance.value.pullDistance) / instance.value.options.maxPullDistance,
  1,
)
const opacity = ['finished', 'initial'].includes(instance.value.status)
  ? '0'
  : `${Math.min(0.6 + arcProgress, 1)}`

onMounted(() => {
  if (!props.local) {
    document.body.classList.add('hasPullToRefresh')
  }
})

watch(
  () => instance.value.status,
  (status) => {
    document.body.classList.toggle('pullToRefreshPulling', status === 'pulling')
  },
)

onUnmounted(() => {
  if (!props.local) {
    document.body.classList.remove('hasPullToRefresh')
  }
  document.body.classList.remove('pullToRefreshPulling')
})
</script>

<template>
  <div
    ref="refreshDomRef"
    class="refreshWraper"
    :class="{ pageScroll: !local }"
    :style="
      {
        '--delay': `${instance.status === 'pulling' ? -arcProgress : 0}s`,
        transform: `translate(-50%, ${instance.pullDistance}px) scale(${
          instance.status === 'finished' ? 0.4 : 1
        })`,
        opacity,
      } as React.CSSProperties & Record<string, string>
    "
  >
    <svg
      class="indicator"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        class="circle"
        :class="instance.status"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  </div>
</template>

<style scoped>
@import url(../styles/index.module.css);
</style>
