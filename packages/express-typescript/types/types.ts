import { Request, Response, RequestHandler as Middleware } from 'express'
type Method = 'get' | 'head' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace' | 'patch'
export type Handler = (req: Request, res: Response) => any
export type Route = {
  method: Method
  path: string
  middleware: Middleware[]
  handler: Handler
}

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
