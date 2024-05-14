import { baseRequest, $http } from '@zgj/api'
const baseURL = 'http://10.0.22.110' // 所有请求的公共地址部分
// ...arg: data; config
const request = (url, ...arg) => baseRequest(`${baseURL}:3000/${url}`, ...arg)

export function getPositionOfPoi(data) {
  return request('api/search', data, 'get')
}
