<script setup lang="ts">
import { type VirtualizerInstance, VirtualList } from '@z-cloud/virtual-vue'
import { ref } from 'vue'
import { randomSize, randomColors } from '../../utils'

const instanceRef = ref<VirtualizerInstance>()

const onReady = (virtualizer: VirtualizerInstance) => {
  instanceRef.value = virtualizer
}
</script>

<template>
  <div>
    <div className="demo-btns">
      <button @click="instanceRef?.scrollToIndex(2000, { behavior: 'smooth' })">scrollToIndex(2000) with smooth</button>
      <button @click="instanceRef?.scrollToIndex(3000, { align: 'center' })">
        scrollToIndex(3000) with align center
      </button>
      <button @click="instanceRef?.scrollToOffset(4000, 'smooth')">scrollToOffset(4000) with smooth</button>
    </div>
    <VirtualList
      itemClassName="demo-list-item"
      horizontal
      style="height: 400px"
      :size="() => randomSize() + 80"
      :count="10000"
      :lanes="2"
      :gap="8"
      @ready="onReady"
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
