import { Request, Response, RequestHandler as Middleware, NextFunction } from 'express'
type Method = 'get' | 'head' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace' | 'patch'
export type PgsqlConfig = {
  host: string
  port: number
  user: string
  password: string
  database: string
  timezone: string
}
// 控制器
export type User = { username: string; password: string }
// 用户数据类型
export type UserData = {
  id: string
  userName: string
  roleId: number
  roleName: string
}
// 继承使用两种形式 type中使用&； interface中使用extends
export type RequestExtend = Request & {
  currentUser: UserData
}
export type ResponseExtend = Response & {
  currentUser: UserData
}
export interface NextFunctionExtend extends NextFunction {}

export type Handler = (req: RequestExtend, res: ResponseExtend, next?: NextFunctionExtend) => void
