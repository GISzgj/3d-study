import { Request, Response, NextFunction } from 'express'
import BaseService from '../services/baseService'
import sendResponse from '../utils/sendResponse'
import jwt from 'jsonwebtoken'
import authMap from '../utils/auth'
// const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
router.use((req: Request, res: Response, next: NextFunction) => {
  // 接口权限
  const authority = authMap.get(req.path)
  if (!authority) {
    // 不做权限权限校验, 直接将执行权转交后续中间件
    next()
    return
  }
  // 判断用户的权限,是否符合接口权限
  const token = req.headers.Token
  if (!token) return sendResponse(res, 'NO_AUTHORITY', null)
  jwt.verify(token, 'secret', (err, decoded) => {})

  sendResponse(res, 'SUCCESS', authority)
})
export default router
