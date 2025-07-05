<script setup lang="ts">
import { PullToRefresh } from '@z-cloud/pull-to-refresh/vue'

const onRefresh = (): Promise<boolean> =>
  new Promise((resolve) => setTimeout(() => resolve(true), 3000))
</script>

<template>
  <div
    style="
      position: relative;
      overflow: auto;
      height: 400px;
      padding: 20px;
      border: 1px solid #999;
      background: #f2f2f2;
    "
  >
    <div>当前属于局部刷新，兼容PC、Mobile</div>
    <br />
    <div>请将当前滚动元素滚动到最顶部，PC端按住鼠标向下拉查看效果</div>
    <PullToRefresh local @refresh="onRefresh" />
    <div style="height: 2000px">我是有很多内容的</div>
  </div>
</template>
