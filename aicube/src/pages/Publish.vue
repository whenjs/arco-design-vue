<script setup lang="ts">
import { reactive } from 'vue'
import { usePostsStore } from '../stores/posts'

const posts = usePostsStore()
const form = reactive({
  mode: 'quick' as 'quick'|'editor'|'workflow',
  title: '',
  content: '',
  tags: [] as string[],
  visibility: 'team' as 'private'|'team'|'public'
})

function publish() {
  posts.create({ title: form.title || '未命名动态', content: form.content, tags: form.tags, visibility: form.visibility, source: form.mode === 'workflow' ? 'workflow' : 'manual' })
}
</script>

<template>
  <a-space direction="vertical" fill>
    <a-card title="发布动态">
      <a-radio-group v-model="form.mode" type="button">
        <a-radio value="quick">快速发布</a-radio>
        <a-radio value="editor">深度编辑器</a-radio>
        <a-radio value="workflow">从工作流发布</a-radio>
      </a-radio-group>
      <a-divider />
      <a-form layout="vertical">
        <a-form-item label="标题">
          <a-input v-model="form.title" placeholder="如：每周分析 - 第32周" />
        </a-form-item>
        <a-form-item label="内容">
          <a-textarea v-model="form.content" :auto-size="{minRows:8}" placeholder="输入或粘贴内容，支持Markdown" />
        </a-form-item>
        <a-form-item label="标签">
          <a-select v-model="form.tags" multiple allow-create style="width:320px" />
        </a-form-item>
        <a-form-item label="可见性">
          <a-segmented v-model="form.visibility" :options="[
            {label:'仅自己',value:'private'},{label:'团队',value:'team'},{label:'公开',value:'public'}
          ]" />
        </a-form-item>
        <a-space>
          <a-button type="primary" @click="publish">发布</a-button>
          <a-button>保存草稿</a-button>
        </a-space>
      </a-form>
    </a-card>
    <a-card title="最近发布">
      <a-list :data="posts.list">
        <template #item="{ item }">
          <a-list-item :key="item.id">
            <a-list-item-meta :title="item.title" :description="new Date(item.createdAt).toLocaleString() + ' · ' + (item.tags||[]).join(', ')" />
            <template #actions>
              <a-tag v-if="item.source==='workflow'" color="green">来自工作流</a-tag>
              <a-tag>{{ item.visibility }}</a-tag>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </a-space>
</template>

<style scoped>
</style>

