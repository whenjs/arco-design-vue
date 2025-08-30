import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const QuickCapture = () => import('../pages/QuickCapture.vue')
const PromptEditor = () => import('../pages/PromptEditor.vue')
const Sandbox = () => import('../pages/Sandbox.vue')
const CompareMatrix = () => import('../pages/CompareMatrix.vue')
const KnowledgeLibrary = () => import('../pages/KnowledgeLibrary.vue')
const WorkflowCanvas = () => import('../pages/WorkflowCanvas.vue')
const Publish = () => import('../pages/Publish.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/sandbox' },
  { path: '/capture', name: 'QuickCapture', component: QuickCapture },
  { path: '/editor', name: 'PromptEditor', component: PromptEditor },
  { path: '/sandbox', name: 'Sandbox', component: Sandbox },
  { path: '/compare', name: 'CompareMatrix', component: CompareMatrix },
  { path: '/library', name: 'KnowledgeLibrary', component: KnowledgeLibrary },
  { path: '/workflow', name: 'WorkflowCanvas', component: WorkflowCanvas },
  { path: '/publish', name: 'Publish', component: Publish }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

