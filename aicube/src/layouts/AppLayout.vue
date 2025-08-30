<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import QuickCaptureDrawer from '../components/QuickCaptureDrawer.vue'

const collapsed = ref(false)
const quickVisible = ref(false)
const router = useRouter()
const route = useRoute()

function onGlobalHotkey(e: KeyboardEvent) {
  const isMac = navigator.platform.toUpperCase().includes('MAC')
  if ((isMac && e.metaKey && e.key.toLowerCase() === 'j') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'j')) {
    e.preventDefault()
    quickVisible.value = true
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalHotkey))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalHotkey))

function onMenuClick(path: string) {
  router.push(path)
}
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider :collapsed="collapsed" collapsible @collapse="(v)=>collapsed=v">
      <div style="height: 48px; display:flex; align-items:center; justify-content:center; font-weight:600;">
        AICube
      </div>
      <a-menu :selected-keys="[route.path]" :default-open-keys="['features']" @menu-item-click="onMenuClick">
        <a-menu-item key="/capture">快速记录</a-menu-item>
        <a-sub-menu key="features">
          <template #title>功能</template>
          <a-menu-item key="/editor">提示词编辑</a-menu-item>
          <a-menu-item key="/sandbox">场景沙盒</a-menu-item>
          <a-menu-item key="/compare">对比矩阵</a-menu-item>
          <a-menu-item key="/library">知识库</a-menu-item>
          <a-menu-item key="/workflow">工作流</a-menu-item>
          <a-menu-item key="/publish">发布动态</a-menu-item>
        </a-sub-menu>
      </a-menu>
      <div style="padding:12px">
        <a-button long type="primary" @click="quickVisible=true">Ctrl/Cmd+J 快速记录</a-button>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="display:flex; align-items:center; justify-content:space-between;">
        <div>AICube · 给你的模型装上操作系统</div>
        <div>
          <a-space>
            <a-button type="text" @click="onMenuClick('/library')">模板库</a-button>
            <a-button type="primary" @click="onMenuClick('/publish')">发布</a-button>
          </a-space>
        </div>
      </a-layout-header>
      <a-layout-content style="padding:16px">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
  <QuickCaptureDrawer v-model:visible="quickVisible" />
  <a-back-top />
</template>

<style scoped>
</style>

