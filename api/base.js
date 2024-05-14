import axios from 'axios'
import { $tool } from '@zgj/utils'
const _http = axios.create({
  // 在相应的文件中做vite代理配置
  // baseURL: '/api',
  timeout: 20000 // 请求超时时间 这里的意思是当请求时间超过5秒还未取得结果时 提示用户请求超时
})
// 满足一定条件后修改请求头的token;请求时拦截下来，做一些处理，例如配置请求头
_http.interceptors.request.use(
  config => {
    const token = $tool.data.get('TOKEN')
    if (token) {
      // config.headers.token = token
      config.headers['Token'] = token
    }
    return config
  },
  err => {
    Promise.reject(err)
  }
)

_http.interceptors.response.use(
  res => {
    const { status, data } = res
    if (status == 200) {
      return res.data
    }
    return Promise.resolve(res)
  },
  err => {
    Promise.reject(err)
  }
)
// 适配器, 用于适配不同的请求方式;
/**
 *
 * @param {string} url 请求地址
 * @param {object} value 携带的数据
 * @param {string} method
 * @param {object} options 配置项,axios的配置
 * @returns _http
 */
export const baseRequest = (url, value = {}, method = 'post', options = {}) => {
  // url = sysConfig.API_URL + url
  if (method === 'post') {
    return _http.post(url, value, options)
  } else if (method === 'get') {
    return _http.get(url, { params: value, ...options })
  } else if (method === 'formdata') {
    // form-data表单提交的方式
    return _http.post(url, qs.stringify(value), {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...options
    })
  } else {
    // 其他请求方式，例如：put、delete
    return _http({
      url: url,
      data: value,
      method: method,
      ...options
    })
  }
}
export const $http = _http
