<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, useCssModule, type CSSProperties } from 'vue'
import { usePullToRefresh } from './hooks/use-pull-to-refresh'
import { PullToRefreshProps } from './typings'
import { useEventBind } from './hooks/use-event-bind'

const props = withDefaults(defineProps<PullToRefreshProps>(), {
  local: false,
})

const classes = useCssModule('classes')

defineEmits(['refresh'])

const refreshDomRef = ref<HTMLElement | null>(null)

const instance = usePullToRefresh(props)
useEventBind(instance.value, props.local ? refreshDomRef : void 0)

const arcProgress = computed(() =>
  Math.min(Math.max(0, instance.value.pullDistance) / instance.value.options.maxPullDistance, 1),
)

const opacity = computed(() => {
  return ['finished', 'initial'].includes(instance.value.status)
    ? '0'
    : `${Math.min(0.6 + arcProgress.value, 1)}`
})

const onTransitionEnd = () => {
  if (instance.value.status === 'finished') {
    instance.value.reset()
  }
}

onMounted(() => {
  if (!props.local) {
    document.body.classList.add(classes.hasPullToRefresh!)
  }
})

watch(
  () => instance.value.status,
  (status) => {
    document.body.classList.toggle(classes.pullToRefreshPulling!, status === 'pulling')
  },
)

onUnmounted(() => {
  if (!props.local) {
    document.body.classList.remove(classes.hasPullToRefresh!)
  }
  document.body.classList.remove(classes.pullToRefreshPulling!)
})
</script>

<template>
  <div
    ref="refreshDomRef"
    :class="[classes.refreshWraper, { [classes.pageScroll ?? '']: !local }]"
    :style="
      {
        '--delay': `${instance.status === 'pulling' ? -arcProgress : 0}s`,
        transform: `translate(-50%, ${instance.pullDistance}px) scale(${
          instance.status === 'finished' ? 0.4 : 1
        })`,
        opacity,
      } as CSSProperties & Record<string, string>
    "
    @transitionend="onTransitionEnd"
  >
    <svg
      :class="classes.indicator"
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
        :class="[classes.circle, classes[instance.status]]"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  </div>
</template>

<style module="classes">
@import url(../styles/index.module.css);
</style>
