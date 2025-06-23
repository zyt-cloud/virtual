<script setup lang="ts">
import { VirtualList } from '@z-cloud/virtual-vue'
import { randomColors } from '../../utils'

const dynamicSizes = new Array(10000).fill(true).map(() => Math.round(Math.random() * 80 + 80))
</script>

<template>
  <div>
    <VirtualList
      itemClassName="demo-list-item"
      style="height: 500px"
      dynamic-size
      :overscan="4"
      :size="60"
      :count="5000"
      :lanes="2"
      :gap="8"
    >
      <template #default="{ index }">
        <div
          :style="{ backgroundColor: randomColors[index % randomColors.length], height: `${dynamicSizes[index]}px` }"
          :class="index % 2 ? 'demo-list-odd' : 'demo-list-even'"
        />
      </template>
    </VirtualList>
  </div>
</template>
