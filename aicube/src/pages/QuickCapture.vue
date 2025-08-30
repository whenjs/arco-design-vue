<script setup lang="ts">
import QuickCaptureDrawer from '../components/QuickCaptureDrawer.vue'
import { ref } from 'vue'

const visible = ref(true)
</script>

<template>
  <a-card title="快速记录">
    <p>使用 Ctrl/Cmd + J 随时打开记录面板。</p>
    <a-button type="primary" @click="visible=true">打开记录面板</a-button>
  </a-card>
  <QuickCaptureDrawer v-model:visible="visible" />
</template>

<style scoped>
</style>

