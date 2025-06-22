<script setup lang="ts" name="VirtualList">
import NormalVirtualList from './normal.vue'
import GridVirtualList from './grid.vue'
import type { VirtualListProps } from '../typings';
import { mergeProps } from 'vue';

const props = withDefaults(defineProps<VirtualListProps>(), {
  dynamicSize: false,
})
</script>

<template>
  <component :is="props.grid ? GridVirtualList : NormalVirtualList" v-bind="mergeProps(props, $attrs)" />
</template>
