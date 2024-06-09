import jwt from 'jsonwebtoken'
import { UserData, RequestExtend, ResponseExtend } from '../types/types'
import sendResponse from '../utils/sendResponse'
import { jwtConfig } from '../config/index'
import UserService from '../services/userService'
import RoleMenuService from '../services/roleMenuService'
const express = require('express')
const router = express.Router()
router.post('/login', async (req: RequestExtend, res: ResponseExtend) => {
  const params = req.body
  try {
    const userDataRes = await UserService.getUserInfo(params.userName, params.password)

    const userData: UserData = {
      id: userDataRes.id,
      userName: userDataRes.user_name,
      roleId: userDataRes.role_id,
      roleName: userDataRes.role_name
    }
    const Token = jwt.sign(userData, jwtConfig.secret, { expiresIn: jwtConfig.expireTime })
    // 根据当前用户角色获取菜单
    const roleMenuRes = await RoleMenuService.getRoleMenu(userData.roleId)
    sendResponse(res, 'SUCCESS', {
      token: Token,
      menus: roleMenuRes,
      userData: {
        ...userData,
        avator: userDataRes.avatar,
        nickname: userDataRes.nickname,
        lastLoginTime: userDataRes.last_login_time,
        createTime: userDataRes.create_time,
        updateTime: userDataRes.update_time
      }
    })
  } catch (error) {
    sendResponse(res, 'ERROR', error)
  }
})
router.post('/register', (req: RequestExtend, res: ResponseExtend) => {
  // 注册新用户
  const roleID = 2 // 默认注册为管理员
  const params = req.body
  const userName = params.userName
  const password = params.password
  UserService.register(userName, password, roleID)
    .then(result => {
      sendResponse(res, 'SUCCESS', result)
    })
    .catch(err => {
      sendResponse(res, 'USER_IS_REGISTER', err.message)
    })
})
// 获取当前用户
router.get('/current', (req: RequestExtend, res: ResponseExtend) => {
  RoleMenuService.getRoleMenu(req.currentUser.roleId).then((roleMenuRes: any) => {
    sendResponse(res, 'SUCCESS', {
      a: req.currentUser,
      b: roleMenuRes
    })
  })
})
export default router
