import { Request, Response } from 'express'
import Test from '../services/testService'
import sendResponse from '../utils/sendResponse'
import { requestLogger } from '../middleware/requestLogger'
const express = require('express')
const router = express.Router()
router.get('/', (req: Request, res: Response) => {
  Test.test().then(resData => {
    sendResponse(res, 'ERROR', resData)
  })
})
router.get('/img_code', requestLogger, (req: Request, response: Response) => {
  Test.test2()
    .then(res => {
      sendResponse(response, 'SUCCESS', res)
    })
    .catch(err => {
      sendResponse(response, 'ERROR', err)
    })
})

export default router
