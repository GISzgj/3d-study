import testControler from '../controllers/test'
import proxyControler from '../controllers/proxy'
import baseControler from '../controllers/base'
import userController from '../controllers/user'
import { Application } from 'express'
const proxyPath = '/proxy'
const apiPath = '/api'
// 分配路由控制器给不同的路由
const routes = (app: Application) => {
  app.use('/test', testControler)
  // /api的基础控制器; 涉及token验证-权限校验
  app.use(apiPath, baseControler)
  app.use(apiPath + '/user', userController)
  // /proxy 代理控制器, 反向代理一些外部资源
  app.use(proxyPath, proxyControler)
}
export default routes
