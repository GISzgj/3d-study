import axios from 'axios'
import Transformation from '../utils/transformation'
const transformation = new Transformation()
// 定义响应代码常量
const IsGaode = {
  isGaode: true,
  notGaode: false
} as const
type IsGaodeKey = keyof typeof IsGaode

function isCoordinateArray(arr: any): arr is [number, number] {
  return Array.isArray(arr) && arr.length === 2 && typeof arr[0] === 'number' && arr[0] < 180
}

class ProxyData {
  constructor() {}
  static async getGeoJson(pathUrl: string, isGaode: IsGaodeKey = 'notGaode') {
    try {
      const json = await axios(pathUrl)
      let data = json.data
      if (IsGaode[isGaode]) {
        ProxyData.processCoordinates(json.data.features)
      }
      return data
    } catch (error) {
      throw error
    }
  }
  static processCoordinates(obj: any): void {
    if (isCoordinateArray(obj)) {
      const transformData = transformation.gcj02towgs84(obj[0], obj[1])
      obj[0] = transformData[0]
      obj[1] = transformData[1]
    } else if (Array.isArray(obj)) {
      for (const item of obj) {
        ProxyData.processCoordinates(item)
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          ProxyData.processCoordinates(obj[key])
        }
      }
    }
  }
}
export default ProxyData
