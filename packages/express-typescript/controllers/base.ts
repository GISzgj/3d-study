import BaseService from '../services/baseService'
import { RequestExtend, ResponseExtend, NextFunctionExtend } from '../types/types'
const express = require('express')
const router = express.Router()

router.use((req: RequestExtend, res: ResponseExtend, next: NextFunctionExtend) => {
  BaseService.judgePermission(req, res, next)
})
export default router
