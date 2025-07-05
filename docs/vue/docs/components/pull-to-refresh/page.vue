<script setup lang="ts">
import { PullToRefresh } from '@z-cloud/pull-to-refresh/vue'

const onRefresh = (): Promise<boolean> =>
  new Promise((resolve) => setTimeout(() => resolve(true), 3000))
</script>

<template>
  <div>
    <div>当前属于页面级别的刷新，兼容PC、Mobile</div>
    <br />
    <div>请注意顶部遮挡</div>
    <br />
    <div>请将页面滚动到最顶部，PC端按住鼠标向下拉查看效果</div>
    <PullToRefresh style="top: 64px" @refresh="onRefresh" />
  </div>
</template>
