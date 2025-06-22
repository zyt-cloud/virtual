<script setup lang="ts">
import { onMounted, onScopeDispose, ref } from 'vue';
import { useVirualizer } from '../hooks/use-virtualizer';
import type { VirtualizerInstance, VirtualListProps } from '../typings';

const props = defineProps<VirtualListProps>()

// const emit = defineEmits<{
//   // (e: 'change', scrolling: boolean): void;
//   (
//     e: 'ready',
//     virtualizer: VirtualizerInstance,
//     colVirtualizer?: VirtualizerInstance,
//   ): void;
// }>();

const containerRef = ref(null);

const virtualizerRef = useVirualizer(props, containerRef);


onMounted(() => {
  virtualizerRef.value.init();
  props.onReady?.(virtualizerRef.value)
});

onScopeDispose(() => virtualizerRef.value.clean());

console.log(29, props)
</script>

<template>
  <div ref="containerRef">normal virtual list</div>
</template>