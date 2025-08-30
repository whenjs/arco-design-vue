<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePromptsStore } from '../stores/prompts'
import DiffMatchPatch from 'diff-match-patch'

const route = useRoute()
const store = usePromptsStore()
const id = computed(() => (route.query.id as string) || store.items[0]?.id)
const item = computed(() => (id.value ? store.findById(id.value) : undefined))
const content = ref(item.value?.content || '')
watch(item, (v) => (content.value = v?.content || ''))

function save() {
  if (!item.value || !id.value) return
  store.updatePrompt(id.value, { content: content.value })
}

const versionNote = ref('')
function snapshot() {
  if (!id.value) return
  store.addVersion(id.value, versionNote.value || '优化调整')
  versionNote.value = ''
}

const dmp = new DiffMatchPatch()
const selectedVersion = ref<string>('')
const diffHtml = computed(() => {
  if (!item.value || !selectedVersion.value) return ''
  const v = item.value.versions.find(v => v.id === selectedVersion.value)
  if (!v) return ''
  const diffs = dmp.diff_main(v.content, content.value) as Array<[number, string]>
  dmp.diff_cleanupSemantic(diffs as any)
  return (diffs as Array<[number, string]>).map(([op, text]: [number, string]) => {
    if (op === 1) return `<ins style=\"background:#e6fffb;\">${text}</ins>`
    if (op === -1) return `<del style=\"background:#fff1f0;\">${text}</del>`
    return `<span>${text}</span>`
  }).join('')
})
</script>

<template>
  <a-space direction="vertical" fill>
    <a-card :title="item?.title || '提示词编辑'" :extra="'ID: '+(id||'')">
      <a-textarea v-model="content" :auto-size="{minRows:8}" placeholder="在此编辑你的提示词..." />
      <a-space style="margin-top:12px">
        <a-button type="primary" @click="save">保存</a-button>
        <a-input v-model="versionNote" style="width:220px" placeholder="版本说明(可选)" />
        <a-button @click="snapshot">保存为版本</a-button>
      </a-space>
    </a-card>

    <a-card title="版本与Diff">
      <a-space>
        <a-select v-model="selectedVersion" :options="item?.versions.map(v=>({label:new Date(v.createdAt).toLocaleString()+ ' · '+v.message, value:v.id})) || []" style="width:360px" placeholder="选择历史版本" />
      </a-space>
      <div style="margin-top:12px; border:1px solid var(--color-fill-3); padding:8px; min-height:120px" v-html="diffHtml"></div>
    </a-card>
  </a-space>
</template>

<style scoped>
</style>

