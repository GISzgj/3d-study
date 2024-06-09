import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import DEFAULT_CONFIG from '@/config/index'

export const layoutStore = defineStore('counter', () => {
  // 列表是否折叠
  const MENU_IS_COLLAPSE = ref(DEFAULT_CONFIG.MENU_IS_COLLAPSE)
  return { MENU_IS_COLLAPSE }
})
