<script setup lang="ts" name="VirtualList">
import NormalVirtualList from './normal.vue';
import GridVirtualList from './grid.vue';
import type { VirtualListProps } from '../typings';
import { mergeProps, h } from 'vue';

const props = withDefaults(defineProps<VirtualListProps>(), {
  dynamicSize: false,
});
</script>

<template>
  <component :is="h(props.grid ? GridVirtualList : NormalVirtualList, mergeProps(props, $attrs), $slots)" />
  <!-- <component :is="props.grid ? GridVirtualList : NormalVirtualList" v-bind="mergeProps(props, $attrs)">
    <template v-for="(_, slotName) in slots" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps"></slot>
    </template>
</component> -->
</template>
