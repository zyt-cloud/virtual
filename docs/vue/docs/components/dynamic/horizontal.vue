<script setup lang="ts">
import { type VirtualizerInstance, VirtualList } from '@z-cloud/virtual-vue'
import { ref } from 'vue'
import { randomSize } from '../../utils'

const instanceRef = ref<VirtualizerInstance>()

const dynamicSizes = new Array(10000).fill(true).map(() => randomSize() + 80)

const onReady = (virtualizer: VirtualizerInstance) => {
  instanceRef.value = virtualizer
}
</script>

<template>
  <div>
    <div className="demo-btns">
      <button @click="instanceRef?.scrollToIndex(3000, { align: 'center' })">
        scrollToIndex(3000) with align center
      </button>
      <button @click="instanceRef?.scrollToOffset(4000)">scrollToOffset(4000)</button>
    </div>
    <VirtualList
      itemClassName="demo-list-item"
      horizontal
      style="height: 100px; width: 100%"
      :count="10000"
      :size="100"
      dynamic-size
      @ready="onReady"
    >
      <template #default="{ index }">
        <div :style="{ width: `${dynamicSizes[index]}px` }" :class="index % 2 ? 'demo-list-odd' : 'demo-list-even'">
          第 {{ index }} 列
        </div>
      </template>
    </VirtualList>
  </div>
</template>
