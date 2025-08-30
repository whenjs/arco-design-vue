import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '../utils/persist'

export interface PostItem {
  id: string
  title: string
  content: string
  tags: string[]
  visibility: 'private'|'team'|'public'
  source?: 'manual'|'workflow'
  createdAt: number
}

interface PostsState {
  items: PostItem[]
}

const STORAGE_KEY = 'aicube_posts_v1'

function uid(prefix = 'post'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => loadFromStorage<PostsState>(STORAGE_KEY, { items: [] }),
  getters: {
    list: (s) => s.items
  },
  actions: {
    persist() { saveToStorage(STORAGE_KEY, this.$state) },
    create(payload: Omit<PostItem, 'id'|'createdAt'>): string {
      const id = uid('post')
      const item: PostItem = { id, createdAt: Date.now(), ...payload }
      this.items.unshift(item)
      this.persist()
      return id
    }
  }
})

