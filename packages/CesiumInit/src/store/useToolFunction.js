import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useToolFunction = defineStore('toolFunction', () => {
  // 开挖
  const excavate = ref(false)
  const toggleExcavate = () => {
    excavate.value = !excavate.value
  }
  // 方量
  const quantity = ref(false)
  const toggleQuantity = () => {
    quantity.value = !quantity.value
  }
  return {
    excavate,
    toggleExcavate,
    quantity,
    toggleQuantity
  }
})
