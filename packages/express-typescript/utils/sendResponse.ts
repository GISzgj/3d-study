import { Response } from 'express'

// 定义响应代码常量
const ResponseCodes = {
  SUCCESS: '200',
  ERROR: '500',
  NO_AUTHORITY: '401',
  NO_TOKEN: '400'
} as const
const MessageCodes = {
  SUCCESS: '操作成功',
  ERROR: '操作失败',
  NO_AUTHORITY: '无权限访问',
  NO_TOKEN: '未提供令牌'
} as const
// 定义响应代码键的类型
type ResponseCodeKey = keyof typeof ResponseCodes
/**
 * @description 通用响应处理函数
 * @param response - Express 响应对象
 * @param codeKey - 响应代码的字符串键
 * @param data - 响应数据
 */
const sendResponse = (response: Response, codeKey: ResponseCodeKey, data: any) => {
  const code = ResponseCodes[codeKey]
  const message = MessageCodes[codeKey]
  response.send({ code, data, message })
}

export default sendResponse
export { ResponseCodes, ResponseCodeKey }
