<script setup lang="ts">
import { type VirtualizerInstance, VirtualList } from '@z-cloud/virtual-vue'
import { ref } from 'vue'
import { randomSize } from '../../utils'

const instanceRef = ref<VirtualizerInstance>()
const dynamicSizes = new Array(10000).fill(true).map(() => randomSize())

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
      dynamic-size
      style="height: 400px"
      :count="10000"
      :size="60"
      @ready="onReady"
    >
      <template #default="{ index }">
        <div
          :style="{ height: `${dynamicSizes[index]}px` }"
          :class="index % 2 ? 'demo-list-odd' : 'demo-list-even'"
        >
          第 {{ index }} 行
        </div>
      </template>
    </VirtualList>
  </div>
</template>
