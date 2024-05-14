import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCameraPosition = defineStore('cameraPosition', () => {
  const cameraPositions = [
    {
      name: '初始相机位置',
      x: -19445135.87525839,
      y: -5350347.827549981,
      z: 7119527.054995788,
      heading: 5.329070518200751e-15,
      pitch: -1.5697436232594648,
      roll: 0
    },
    {
      name: '宜昌市CameraPosition',
      heading: 6.273078080939435,
      pitch: -1.2429857172535548,
      roll: 6.261017868900235,
      x: -3412019.706671493,
      y: 9333474.499626411,
      z: 3452258.9313796507
    }
  ]
  return {
    cameraPositions
  }
})
