import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMeasureState = defineStore('measureState', () => {
  const isMeasure = false
  return {
    isMeasure
  }
})
