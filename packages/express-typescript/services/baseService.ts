import sendResponse from '../utils/sendResponse'
import { UserData, RequestExtend, ResponseExtend, NextFunctionExtend } from '../types/types'
import jwt from 'jsonwebtoken'
import authMap from '../utils/auth'
import { jwtConfig } from '../config/index'
// 定义前端传过来的请求头
const TokenHeader: string = 'token'
class BaseService {
  constructor() {}
  static judgePermission(req: RequestExtend, res: ResponseExtend, next: NextFunctionExtend) {
    // 接口权限
    const authority = authMap.get(req.path)
    if (!authority) {
      // 不做权限权限校验, 直接将执行权转交后续中间件
      next()
      return
    }
    // 判断用户的权限,是否符合接口权限
    const token = req.headers[TokenHeader]
    if (typeof token !== 'string') return sendResponse(res, 'NO_TOKEN', null)
    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) {
        console.error(err)
        return sendResponse(res, 'NO_TOKEN', null)
      }
      const payload = decoded as UserData
      // token是否和权限符合
      if (!authority.role.includes(payload.roleName)) {
        return sendResponse(res, 'NO_TOKEN_AUTHORITY', null)
      }
      req.currentUser = payload
      next()
    })
  }
}
export default BaseService
