import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios'
import tool from './tool'

// 创建 Axios 实例
const _http: AxiosInstance = axios.create({
  // baseURL: '/api',
  timeout: 20000 // 请求超时时间 这里的意思是当请求时间超过20秒还未取得结果时 提示用户请求超时
})

// 请求拦截器
_http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tool.data.get('TOKEN')
    if (token) {
      config.headers.Token = token
    }
    return config
  },
  (err: AxiosError) => {
    return Promise.reject(err)
  }
)

// 响应拦截器
_http.interceptors.response.use(
  (res: AxiosResponse) => {
    const { status, data } = res
    if (status === 200) {
      return data
    }
    return Promise.resolve(res)
  },
  (err: AxiosError) => {
    return Promise.reject(err)
  }
)

// 适配器, 用于适配不同的请求方式
/**
 *
 * @param {string} url 请求地址
 * @param {object} value 携带的数据
 * @param {string} method 请求方法
 * @param {object} options 配置项, axios 的配置
 * @returns Promise
 */
export const baseRequest = (
  url: string,
  value: Record<string, any> = {},
  method: 'post' | 'get' | 'formdata' | 'put' | 'delete' = 'post',
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  // url = sysConfig.API_URL + url
  if (method === 'post') {
    return _http.post(url, value, options)
  } else if (method === 'get') {
    return _http.get(url, { params: value, ...options })
  } else if (method === 'formdata') {
    // form-data 表单提交的方式
    const formData = new FormData()
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        formData.append(key, value[key])
      }
    }
    return _http.post(url, formData, {
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
