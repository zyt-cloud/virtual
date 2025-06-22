<script setup lang="ts">
import { VirtualList } from '@z-cloud/virtual-vue'
import { randomSize, randomColors } from '../../utils'
</script>

<template>
  <div>
    <VirtualList
      itemClassName="demo-list-item"
      followPageScroll
      :overscan="4"
      :size="() => randomSize() + 80"
      :count="10000"
      :lanes="2"
      :gap="8"
    >
      <template #default="{ index }">
        <div
          :style="{ backgroundColor: randomColors[index % randomColors.length] }"
          :class="index % 2 ? 'demo-list-odd' : 'demo-list-even'"
        />
      </template>
    </VirtualList>
  </div>
</template>
