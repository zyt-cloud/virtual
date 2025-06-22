<script setup lang="ts" name="VirtualList">
import NormalVirtualList from './normal.vue'
import GridVirtualList from './grid.vue'
import type { VirtualListProps } from '../typings'
import { mergeProps, defineSlots, useAttrs } from 'vue'
import { type VirtualItem } from '@z-cloud/virtual-vanilla'

const props = withDefaults(defineProps<VirtualListProps>(), {
  dynamicSize: false,
})

const attrs = useAttrs()
const mergedProps = mergeProps(attrs as any, props) as unknown as VirtualListProps

const slots = defineSlots<{
  default(props: VirtualItem): any
  grid(props: { rowItem: VirtualItem; colItem: VirtualItem }): any
}>()
</script>

<template>
  <component :is="props.grid ? GridVirtualList : NormalVirtualList" v-bind="mergedProps">
    <template v-for="(_, name) in slots" #[name]="slotProps">
      <slot v-bind="slotProps" :name="name"></slot>
    </template>
  </component>
</template>
