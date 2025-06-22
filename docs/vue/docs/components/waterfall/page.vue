<script setup lang="ts">
import { ref } from 'vue'

const name = ref('test')
</script>
<template>
  <div>
    <slot :test="name" />
  </div>
</template>
