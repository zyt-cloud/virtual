<script setup lang="ts">
import { VirtualList } from '@z-cloud/virtual-vue'
import { randomSize, randomColors } from '../../utils'
import { ref } from 'vue'

const show = ref(false)
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
