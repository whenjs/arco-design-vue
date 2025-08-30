import { defineStore } from 'pinia'
import type { Edge, Node } from '@vue-flow/core'
import { loadFromStorage, saveToStorage } from '../utils/persist'

interface FlowState {
  nodes: Node[]
  edges: Edge[]
  lastOutputs: Record<string, string>
}

const STORAGE_KEY = 'aicube_workflow_v1'

export const useWorkflowStore = defineStore('workflow', {
  state: (): FlowState =>
    loadFromStorage<FlowState>(STORAGE_KEY, {
      nodes: [
        { id: 'n1', position: { x: 50, y: 80 }, data: { label: '输入变量', input: '', output: '' }, type: 'input' },
        { id: 'n2', position: { x: 320, y: 80 }, data: { label: '提示词模板', template: '总结：{{text}}', output: '' } },
        { id: 'n3', position: { x: 590, y: 80 }, data: { label: '结果', output: '' }, type: 'output' }
      ],
      edges: [
        { id: 'e12', source: 'n1', target: 'n2' },
        { id: 'e23', source: 'n2', target: 'n3' }
      ],
      lastOutputs: {}
    }),
  actions: {
    persist() { saveToStorage(STORAGE_KEY, this.$state) },
    setGraph(nodes: Node[], edges: Edge[]) {
      this.nodes = nodes
      this.edges = edges
      this.persist()
    },
    runOnce(vars: Record<string, string> = {}) {
      const outputs: Record<string, string> = {}
      // simple propagation: compute in topological by traversing edges
      const incoming: Record<string, string[]> = {}
      this.edges.forEach(e => {
        (incoming[e.target] ||= []).push(e.source)
      })
      const order = [...this.nodes].sort((a,b)=> (incoming[a.id]?.length||0) - (incoming[b.id]?.length||0))
      for (const node of order) {
        const srcs = Object.entries(incoming).find(([k]) => k === node.id)?.[1] || []
        const inputCombined = srcs.map(sid => outputs[sid] || '').join('\n')
        const data: any = node.data || {}
        let out = ''
        if ('template' in data) {
          out = (data.template as string || '')
          const merged: Record<string, string> = { ...(vars as Record<string,string>), input: inputCombined }
          out = out.replace(/\{\{(\w+)\}\}/g, (_: string, k: string) => (merged[k] ?? ''))
        } else {
          out = inputCombined
        }
        outputs[node.id] = out
      }
      this.lastOutputs = outputs
      this.persist()
    }
  }
})

