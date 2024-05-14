import { login } from './handlers/auth'
import { home } from './handlers/home'
import { signup } from './handlers/user'
import { search } from './handlers/search'
import { ChinaGeojsonProxy, YiLingGeojsonProxy } from './handlers/proxy/geojson'
import { addModel } from './handlers/proxy/gldr'
import { requestLogger } from './middleware/requestLogger'
import { Route } from './types/types'
// 设置 multer 来处理文件上传
// import multer from 'multer'
const multer = require('multer')

const upload = multer()

const proxyPath = '/proxy'
const apiPath = '/api'
export const routes: Route[] = [
  {
    method: 'post',
    path: apiPath + '/app/model/SplitUploadFile',
    middleware: [upload.single('file')],
    handler: addModel
  },
  {
    method: 'get',
    path: proxyPath + '/geojson1',
    middleware: [],
    handler: ChinaGeojsonProxy
  },
  {
    method: 'get',
    path: proxyPath + '/geojson2',
    middleware: [],
    handler: YiLingGeojsonProxy
  },
  {
    method: 'get',
    path: apiPath + '/search',
    middleware: [],
    handler: search
  },
  {
    method: 'get',
    path: '/',
    middleware: [],
    handler: home
  },
  {
    method: 'post',
    path: '/users',
    middleware: [],
    handler: signup
  },
  {
    method: 'post',
    path: '/login',
    middleware: [requestLogger],
    handler: login
  }
]
