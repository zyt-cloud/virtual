<script setup lang="ts">
import { VirtualList } from '@z-cloud/virtual-vue'
</script>

<template>
  <div>
    <VirtualList :count="1000" :size="60"></VirtualList>
  </div>
</template>