<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  prompt: '为以下主题生成三种不同风格的标题：{{topic}}',
  topic: 'AICube 产品发布',
  models: ['gpt-4o-mini', 'claude-3-haiku', 'gemini-1.5-pro'],
  outputs: [] as { model: string; text: string; cost: number; timeMs: number }[]
})

function run() {
  state.outputs = state.models.map((m, i) => ({
    model: m,
    text: `【${m}】标题A/标题B/标题C for ${state.topic}`,
    cost: 0.002 + i * 0.001,
    timeMs: 500 + i * 120
  }))
}
</script>

<template>
  <a-space direction="vertical" fill>
    <a-card title="多模型对比矩阵">
      <a-space>
        <a-input v-model="state.topic" style="width:260px" placeholder="主题" />
        <a-button type="primary" @click="run">运行并对比</a-button>
      </a-space>
      <a-table :data="state.outputs" style="margin-top:12px">
        <a-table-column title="模型" data-index="model" />
        <a-table-column title="输出" data-index="text" />
        <a-table-column title="成本($)">
          <template #cell="{ record }">
            {{ record.cost.toFixed(4) }}
          </template>
        </a-table-column>
        <a-table-column title="用时(ms)" data-index="timeMs" />
      </a-table>
    </a-card>
  </a-space>
</template>

<style scoped>
</style>

