import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import Test from '../services/testService'
import sendResponse from '../utils/sendResponse'
import { requestLogger } from '../middleware/requestLogger'
import { UserData } from '../types/types'
const express = require('express')
const router = express.Router()
const testUserData: UserData = {
  userName: 'zgj',
  id: '123',
  roleId: 0,
  roleName: 'admin'
}
router.get('/login', (req: Request, res: Response) => {
  // const params = req.body
  const Token = jwt.sign(testUserData, 'secret', { expiresIn: '1h' })
  sendResponse(res, 'SUCCESS', Token)
})
router.get('/test', (req: Request, res: Response) => {
  sendResponse(res, 'SUCCESS', 'test')
})
export default router
