<script setup lang="ts">
import { computed, onMounted, ref, defineProps } from 'vue'
import { useVirualizer } from '../hooks/use-virtualizer'
import type { VirtualListProps } from '../typings'

const props = defineProps<VirtualListProps>()
const emit = defineEmits(['ready'])

const containerRef = ref<HTMLDivElement | null>(null)
const virtualizerRef = useVirualizer(props, containerRef)

const gridTemplateAreas = computed(() => {
  const gridAreas = Array.from({ length: props.lanes ?? 1 }, (_, index) =>
    props.horizontal ? `"lane${index}"` : `lane${index}`,
  ).join(' ')

  return props.horizontal ? gridAreas : `"${gridAreas}"`
})

const virtualItems = computed(() => virtualizerRef.value?.getVirtualItems() ?? [])
const totalSize = computed(() => virtualizerRef.value?.getTotalSize() ?? 0)

onMounted(() => {
  if (virtualizerRef.value) {
    virtualizerRef.value.init(props.followPageScroll ? window : containerRef.value!)
    emit('ready', virtualizerRef.value)
  }
})
</script>

<template>
  <div style="overflow: auto" ref="containerRef">
    <div
      :style="{
        display: 'grid',
        gridTemplateAreas,
        gridTemplateColumns: `repeat(${horizontal ? 1 : lanes}, 1fr)`,
        gridTemplateRows: `repeat(${horizontal ? lanes : 1}, 1fr)`,
        alignItems: dynamicSize && !horizontal ? 'start' : 'stretch',
        justifyItems: dynamicSize && horizontal ? 'start' : 'stretch',
        columnGap: horizontal ? void 0 : `${props.gap}px`,
        rowGap: horizontal ? `${props.gap}px` : void 0,
        height: props.horizontal ? '100%' : `${totalSize}px`,
        width: props.horizontal ? `${totalSize}px` : '100%',
      }"
    >
      <div
        v-for="virtualItem in virtualItems"
        :key="virtualItem.index"
        :class="itemClassName"
        :ref="dynamicSize ? virtualizerRef?.elementMounted : void 0"
        :data-index="virtualItem.index"
        :style="{
          ...itemStyle,
          gridArea: `lane${virtualItem.lane}`,
          height: horizontal || dynamicSize ? void 0 : `${virtualItem.size}px`,
          width: !horizontal || dynamicSize ? void 0 : `${virtualItem.size}px`,
          transform: props.horizontal
            ? `translateX(${virtualItem.start}px)`
            : `translateY(${virtualItem.start - (virtualizerRef?.options.scrollMargin ?? 0)}px)`,
        }"
      >
        <slot v-bind="virtualItem" />
      </div>
    </div>
  </div>
</template>
