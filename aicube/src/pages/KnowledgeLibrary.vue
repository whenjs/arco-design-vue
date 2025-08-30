<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePromptsStore } from '../stores/prompts'

const store = usePromptsStore()
const q = ref('')
const tag = ref<string | undefined>(undefined)
const list = computed(() => {
  return store.items.filter(i => {
    const txt = (i.title + ' ' + i.content).toLowerCase()
    const okQ = !q.value || txt.includes(q.value.toLowerCase())
    const okT = !tag.value || i.tags.includes(tag.value)
    return okQ && okT
  })
})
</script>

<template>
  <a-card title="知识与模板库">
    <a-space wrap>
      <a-input-search v-model="q" style="width:300px" placeholder="搜索提示词/内容" />
      <a-select v-model="tag" :options="store.tagOptions" allow-clear style="width:200px" placeholder="按标签筛选" />
    </a-space>
    <a-list :bordered="false" :data="list" style="margin-top:12px">
      <template #item="{ item }">
        <a-list-item>
          <a-list-item-meta :title="item.title" :description="item.tags.join(', ')" />
          <template #actions>
            <a-button size="mini" @click="$router.push('/editor?id='+item.id)">编辑</a-button>
            <a-button size="mini" @click="$router.push('/sandbox')">在沙盒运行</a-button>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<style scoped>
</style>

