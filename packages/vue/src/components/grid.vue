<script setup lang="ts">
import { computed, onMounted, ref, unref } from 'vue'
import { useVirualizer } from '../hooks/use-virtualizer'
import type { VirtualListProps } from '../typings'

const props = defineProps<VirtualListProps>()
const emit = defineEmits(['ready'])

const containerRef = ref<HTMLDivElement | null>(null)
const rowVirtualizerRef = useVirualizer(
  computed(() => ({
    ...unref(props),
    size: props.gridSize?.[1] ?? props.size,
    // grid 模式当前虚拟器只能竖向滚动
    horizontal: false,
  })),
  containerRef,
)
const colVirtualizerRef = useVirualizer(
  computed(() => ({ ...unref(props), size: props.gridSize?.[0] ?? props.size, horizontal: true })),
  containerRef,
)

const virtualItems = computed(() => {
  return [
    rowVirtualizerRef.value?.getVirtualItems() ?? [],
    colVirtualizerRef.value?.getVirtualItems() ?? [],
  ]
})

const totalSize = computed(() => {
  return [
    rowVirtualizerRef.value?.getTotalSize() ?? 0,
    colVirtualizerRef.value?.getTotalSize() ?? 0,
  ]
})

onMounted(() => {
  if (rowVirtualizerRef.value && colVirtualizerRef.value) {
    const scrollElement = props.followPageScroll ? window : containerRef.value!
    rowVirtualizerRef.value.init(scrollElement)
    colVirtualizerRef.value.init(scrollElement)
    emit('ready', rowVirtualizerRef.value, colVirtualizerRef.value)
  }
})
</script>

<template>
  <div style="overflow: auto" ref="containerRef">
    <div
      style="display: grid; grid-template-areas: 'item'"
      :style="{
        height: `${totalSize[0]}px`,
        width: `${totalSize[1]}px`,
      }"
    >
      <template v-for="rowItem in virtualItems[0]" :key="rowItem.index">
        <div
          v-for="colItem in virtualItems[1]"
          :key="colItem.index"
          :class="itemClassName"
          :style="{
            ...itemStyle,
            gridArea: 'item',
            height: `${rowItem.size}px`,
            width: `${colItem.size}px`,
            transform: `translate(${colItem.start}px,${rowItem.start}px)`,
          }"
        >
          <slot v-bind="rowItem" />
          <slot name="grid" :rowItem="rowItem" :colItem="colItem" />
        </div>
      </template>
    </div>
  </div>
</template>
