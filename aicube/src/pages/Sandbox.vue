<script setup lang="ts">
import { computed, reactive } from 'vue'
import { usePromptsStore } from '../stores/prompts'

const prompts = usePromptsStore()
const state = reactive({
  selectedId: prompts.items[0]?.id as string | undefined,
  vars: { code: '', text: '' },
  output: ''
})

const current = computed(() => prompts.findById(state.selectedId || ''))

function run() {
  const template = current.value?.content || ''
  const merged: Record<string, string> = { ...state.vars }
  state.output = template.replace(/\{\{(\w+)\}\}/g, (_: string, k: string) => (merged[k] ?? ''))
}
</script>

<template>
  <a-space direction="vertical" fill>
    <a-card title="场景沙盒">
      <a-space wrap>
        <a-select v-model="state.selectedId" :options="prompts.items.map(i=>({label:i.title, value:i.id}))" style="width:320px" />
        <a-button type="primary" @click="run">运行预览</a-button>
      </a-space>
      <a-grid :cols="24" :col-gap="12" style="margin-top:12px">
        <a-grid-item :span="12">
          <a-card bordered>
            <template #title>变量输入</template>
            <a-form layout="vertical">
              <a-form-item label="code">
                <a-textarea v-model="state.vars.code" :auto-size="{minRows:6}" />
              </a-form-item>
              <a-form-item label="text">
                <a-textarea v-model="state.vars.text" :auto-size="{minRows:3}" />
              </a-form-item>
            </a-form>
          </a-card>
        </a-grid-item>
        <a-grid-item :span="12">
          <a-card bordered>
            <template #title>输出预览</template>
            <a-typography-paragraph>
              <pre style="white-space:pre-wrap">{{ state.output }}</pre>
            </a-typography-paragraph>
          </a-card>
        </a-grid-item>
      </a-grid>
    </a-card>
  </a-space>
</template>

<style scoped>
</style>

