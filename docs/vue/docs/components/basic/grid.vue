<script setup lang="ts">
import { type VirtualizerInstance, VirtualList } from '@z-cloud/virtual-vue'
import { ref } from 'vue'

const instanceRef = ref<VirtualizerInstance>()

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
      style="height: 400px; width: 400px; font-size: 14px"
      :count="5000"
      :size="60"
      grid
      :gridSize="[100, 40]"
      :gap="10"
      :overscan="5"
      @ready="onReady"
    >
      <template #default="{ rowItem, colItem }">
        <div :class="rowItem.index % 2 ? 'demo-list-odd' : 'demo-list-even'">
          cell {{ rowItem.index }} {{ colItem.index }}
        </div>
      </template>
    </VirtualList>
  </div>
</template>
