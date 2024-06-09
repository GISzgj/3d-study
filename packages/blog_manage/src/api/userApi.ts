import { baseRequest, $http } from '../utils/request'
import { type RequestMethod, type RequestOptions } from './apiTypes'
// request函数的类型
const request = (
  url: string,
  data?: RequestOptions,
  method: RequestMethod = 'post',
  config: RequestOptions = {}
) => {
  return baseRequest(`/api/user/${url}`, data, method, config)
}
export default {
  // 用户登录函数
  userLogin(data: RequestOptions): Promise<any> {
    return request('login', data, 'post')
  },
  // 用户注册函数
  userRegister(data: RequestOptions): Promise<any> {
    return request('register', data, 'post')
  },
  userGetCurrent(data?: RequestOptions): Promise<any> {
    return request('current', data, 'get')
  }
}
