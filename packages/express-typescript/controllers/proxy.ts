import { Request, Response } from 'express'
import ProxyData from '../services/proxyService'
import sendResponse from '../utils/sendResponse'
const express = require('express')
const router = express.Router()
router.get('/', (req: Request, res: Response) => {
  sendResponse(res, 'SUCCESS', 'proxy' + '请访问具体的路由、例如： /proxy/geojson/china')
})

// 注意：'geo.datav.aliyun.com' 是高德的坐标系， 还需要做一个到84的转换
router.get('/geojson/china', (req: Request, response: Response) => {
  const ChinaGeojson: string = 'https://geo.datav.aliyun.com/areas_v3/bound/100000.json'
  ProxyData.getGeoJson(ChinaGeojson, 'isGaode')
    .then(data => {
      sendResponse(response, 'SUCCESS', data)
    })
    .catch(err => {
      sendResponse(response, 'ERROR', err)
    })
})
router.get('/geojson/YiLing', (req: Request, response: Response) => {
  const YiLingGeojson = 'https://geo.datav.aliyun.com/areas_v3/bound/420500.json'
  ProxyData.getGeoJson(YiLingGeojson, 'isGaode')
    .then(data => {
      sendResponse(response, 'SUCCESS', data)
    })
    .catch(err => {
      sendResponse(response, 'ERROR', err)
    })
})

export default router
