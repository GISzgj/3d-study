import BaseService from '../services/baseService'
import sendResponse from '../utils/sendResponse'
import { UserData, RequestExtend, ResponseExtend, NextFunctionExtend } from '../types/types'
import jwt from 'jsonwebtoken'
import authMap from '../utils/auth'
// const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()

router.use((req: RequestExtend, res: ResponseExtend, next: NextFunctionExtend) => {
  // 接口权限
  const authority = authMap.get(req.path)
  // if (!authority) {
  //   // 不做权限权限校验, 直接将执行权转交后续中间件
  //   next()
  //   return
  // }
  // 判断用户的权限,是否符合接口权限
  // const token = req.headers.Token
  // if (typeof token !== 'string') return sendResponse(res, 'NO_AUTHORITY', null)
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InpnaiIsImlkIjoiMTIzIiwicm9sZUlkIjowLCJyb2xlTmFtZSI6ImFkbWluIiwiaWF0IjoxNzE3MTQ3MzUzLCJleHAiOjE3MTcxNTA5NTN9.DAqEAlzgmw_dsWod8GUmKBdlVHGqEZIokvJMwL5K5vM'
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      console.error(err)
      return sendResponse(res, 'NO_TOKEN', null)
    }
    const payload = decoded as UserData
    req.currentUser = payload
    next()
  })
  // sendResponse(res, 'SUCCESS', authority)
})
export default router
