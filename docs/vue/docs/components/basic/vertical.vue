<script setup lang="ts">
import { type VirtualizerInstance, VirtualList } from '@z-cloud/virtual-vue'

const onReady = (virtualizer: VirtualizerInstance) => {
  console.log('ready', virtualizer)
}
</script>

<template>
  <div>
    <VirtualList :count="1000" :size="60" @ready="onReady">
      <template #default="{ index }">
        <div>row {{ index }}</div>
      </template>
    </VirtualList>
  </div>
</template>