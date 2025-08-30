<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { storeToRefs } from 'pinia'
import { useWorkflowStore } from '../stores/workflows'

const wf = useWorkflowStore()
const { nodes, edges, lastOutputs } = storeToRefs(wf)
const instance = useVueFlow()

function onSave() {
  wf.setGraph(instance.getNodes.value, instance.getEdges.value)
}

function onRun() {
  wf.runOnce()
}
</script>

<template>
  <a-space direction="vertical" fill>
    <a-card title="工作流编排">
      <a-space>
        <a-button type="primary" @click="onRun">运行</a-button>
        <a-button @click="onSave">保存编排</a-button>
      </a-space>
      <div style="height:480px; margin-top:12px; border:1px solid var(--color-fill-3)">
        <VueFlow v-model:nodes="nodes" v-model:edges="edges">
          <Controls />
          <MiniMap />
        </VueFlow>
      </div>
      <a-card style="margin-top:12px" title="最近一次输出">
        <pre style="white-space:pre-wrap">{{ JSON.stringify(lastOutputs, null, 2) }}</pre>
      </a-card>
    </a-card>
  </a-space>
</template>

<style scoped>
</style>

