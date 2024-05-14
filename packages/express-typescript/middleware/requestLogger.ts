import { RequestHandler as Middleware } from 'express';
// 打印客户端请求路径的中间件
export const requestLogger: Middleware = (req, res, next) => {
  console.log(req.path);
  next();
};