<script setup lang="ts">
import { VirtualList } from '@z-cloud/virtual-vue'
</script>

<template> 
<VirtualList :count="1000" :size="50"></VirtualList>
</template>