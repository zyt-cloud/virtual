<script setup lang="ts">
import { VirtualList } from '@z-cloud/virtual-vue'
import { randomColors } from '../../utils'
import { ref } from 'vue'

const show = ref(false)
const dynamicSizes = new Array(10000).fill(true).map(() => Math.round(Math.random() * 80 + 80))
</script>

<template>
  <div>
    <div class="demo-btns">
      <button @click="show = !show">可以先查看代码，在点击此按钮查看效果</button>
    </div>
    <VirtualList
      itemClassName="demo-list-item"
      followPageScroll
      v-if="show"
      dynamicSize
      :overscan="4"
      :size="60"
      :count="10000"
      :lanes="2"
      :gap="8"
    >
      <template #default="{ index }">
        <div
          :style="{ backgroundColor: randomColors[index % randomColors.length], height: dynamicSizes[index] }"
          :class="index % 2 ? 'demo-list-odd' : 'demo-list-even'"
        />
      </template>
    </VirtualList>
  </div>
</template>
