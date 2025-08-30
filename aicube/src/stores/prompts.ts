import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '../utils/persist'

export type Visibility = 'private' | 'team' | 'public'

export interface PromptVersion {
  id: string
  message: string
  content: string
  createdAt: number
}

export interface PromptItem {
  id: string
  title: string
  content: string
  tags: string[]
  visibility: Visibility
  versions: PromptVersion[]
  createdAt: number
  updatedAt: number
}

interface PromptsState {
  items: PromptItem[]
  tags: string[]
}

const STORAGE_KEY = 'aicube_prompts_v1'

function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export const usePromptsStore = defineStore('prompts', {
  state: (): PromptsState =>
    loadFromStorage<PromptsState>(
      STORAGE_KEY,
      {
        items: [
          {
            id: uid('p'),
            title: '解释这段代码并给出时间复杂度',
            content: '请解释以下代码，并分析时间复杂度。代码：{{code}}',
            tags: ['后端','代码解释'],
            visibility: 'private',
            versions: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        ],
        tags: ['后端','测试','文案','分析']
      }
    ),
  getters: {
    tagOptions: (s) => s.tags.map(t => ({ label: t, value: t })),
    findById: (s) => (id: string) => s.items.find(i => i.id === id)
  },
  actions: {
    persist() { saveToStorage(STORAGE_KEY, this.$state) },
    ensureTag(tag: string) {
      if (!this.tags.includes(tag)) this.tags.push(tag)
    },
    createPrompt(payload: { title: string; content: string; tags: string[]; visibility: Visibility }): string {
      payload.tags.forEach(t => this.ensureTag(t))
      const id = uid('p')
      const now = Date.now()
      const item: PromptItem = { id, versions: [], createdAt: now, updatedAt: now, ...payload }
      this.items.unshift(item)
      this.persist()
      return id
    },
    updatePrompt(id: string, patch: Partial<Omit<PromptItem, 'id'|'createdAt'|'versions'>>) {
      const item = this.items.find(i => i.id === id)
      if (!item) return
      Object.assign(item, patch)
      item.updatedAt = Date.now()
      if (patch.tags) patch.tags.forEach(t => this.ensureTag(t))
      this.persist()
    },
    addVersion(id: string, message: string) {
      const item = this.items.find(i => i.id === id)
      if (!item) return
      const v: PromptVersion = { id: uid('v'), message, content: item.content, createdAt: Date.now() }
      item.versions.unshift(v)
      item.updatedAt = Date.now()
      this.persist()
    },
    removePrompt(id: string) {
      this.items = this.items.filter(i => i.id !== id)
      this.persist()
    }
  }
})

