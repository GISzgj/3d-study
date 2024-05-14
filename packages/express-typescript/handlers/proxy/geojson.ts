import axios from 'axios'
import { Handler } from '../../types/types'
const $http = axios.create({
  // baseURL: '/api',
  timeout: 20000
})
export const ChinaGeojsonProxy: Handler = async (req, res) => {
  try {
    const ChinaGeojson = $http('https://geo.datav.aliyun.com/areas_v3/bound/100000.json')
    const json = await ChinaGeojson
    const data = json.data
    res.status(200).send(data)
  } catch (error) {
    return res.status(401).send(error)
  }
}
export const YiLingGeojsonProxy: Handler = async (req, res) => {
  try {
    const ChinaGeojson = $http('https://geo.datav.aliyun.com/areas_v3/bound/420500.json')
    const json = await ChinaGeojson
    const data = json.data
    res.status(200).send(data)
  } catch (error) {
    return res.status(401).send(error)
  }
}
