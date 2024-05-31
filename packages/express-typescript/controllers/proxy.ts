import { Handler, RequestExtend, ResponseExtend } from '../types/types'
import ProxyData from '../services/proxyService'
import sendResponse from '../utils/sendResponse'
const express = require('express')
const router = express.Router()
router.get('/', ((req, res) => {
  sendResponse(res, 'SUCCESS', 'proxy' + '请访问具体的路由、例如： /proxy/geojson/china')
}) as Handler)

// 注意：'geo.datav.aliyun.com' 是高德的坐标系， 还需要做一个到84的转换
router.get('/geojson/china', ((req, response) => {
  const ChinaGeojson: string = 'https://geo.datav.aliyun.com/areas_v3/bound/100000.json'
  ProxyData.getGeoJson(ChinaGeojson, 'isGaode')
    .then(data => {
      sendResponse(response, 'SUCCESS', data)
    })
    .catch(err => {
      sendResponse(response, 'ERROR', err)
    })
}) as Handler)
router.get('/geojson/YiLing', ((req, response) => {
  const YiLingGeojson = 'https://geo.datav.aliyun.com/areas_v3/bound/420500.json'
  ProxyData.getGeoJson(YiLingGeojson, 'isGaode')
    .then(data => {
      sendResponse(response, 'SUCCESS', data)
    })
    .catch(err => {
      sendResponse(response, 'ERROR', err)
    })
}) as Handler)

export default router
