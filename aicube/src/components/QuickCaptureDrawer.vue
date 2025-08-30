<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { usePromptsStore } from '../stores/prompts'
import { useRouter } from 'vue-router'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'update:visible', v: boolean): void }>()
const router = useRouter()
const prompts = usePromptsStore()

const form = reactive({
  title: '',
  content: '',
  tags: [] as string[],
  visibility: 'private' as 'private' | 'team' | 'public'
})

watch(
  () => props.visible,
  (v) => {
    if (v) {
      form.title = ''
      form.content = ''
      form.tags = []
      form.visibility = 'private'
    }
  }
)

const isDisabled = computed(() => !form.content.trim())

function onSave() {
  const id = prompts.createPrompt({
    title: form.title || form.content.slice(0, 20),
    content: form.content,
    tags: form.tags,
    visibility: form.visibility
  })
  emit('update:visible', false)
  router.push('/editor?id=' + id)
}
</script>

<template>
  <a-drawer :visible="props.visible" @ok="onSave" @cancel="() => emit('update:visible', false)" :ok-button-props="{disabled: isDisabled}">
    <template #title>快速记录</template>
    <a-form layout="vertical">
      <a-form-item label="标题（可选）">
        <a-input v-model="form.title" placeholder="例如：解释这段代码的最佳提示词" />
      </a-form-item>
      <a-form-item label="内容">
        <a-textarea v-model="form.content" placeholder="粘贴你的灵感、片段或上下文..." auto-size :max-length="5000" show-word-limit />
      </a-form-item>
      <a-form-item label="标签">
        <a-select v-model="form.tags" :options="prompts.tagOptions" multiple allow-create placeholder="如：后端、测试、文案" />
      </a-form-item>
      <a-form-item label="可见性">
        <a-segmented v-model="form.visibility" :options="[
          { label: '仅自己', value: 'private' },
          { label: '团队', value: 'team' },
          { label: '公开', value: 'public' }
        ]" />
      </a-form-item>
      <a-alert type="info">快捷键：Ctrl/Cmd + J 打开快速记录面板</a-alert>
    </a-form>
  </a-drawer>
</template>

<style scoped>
</style>

