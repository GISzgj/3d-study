import { baseRequest, $http } from '@zgj/api'
const baseURL = 'http://10.0.33.82' // 所有请求的公共地址部分
// ...arg: data; config
const request = (url, ...arg) => baseRequest(`${baseURL}:8888/${url}`, ...arg)

export function getParking(data) {
  return request('parking/poi/search', data, 'get')
}
export function getHospital(data) {
  return request('HOSPITAL/poi/searchList', data, 'get')
}

export function getGarden(data) {
  return request('GARDEN/poi/searchList', data, 'get')
}
export function getCommittee(data) {
  return request('COMMITTEE/poi/searchList', data, 'get')
}
export function getCompany(data) {
  return request('COMPANY/poi/searchList', data, 'get')
}
export function getBusStation(data) {
  return request('TRANSIT/poi/searchList', data, 'get')
}

// 数据接口
// /parking/poi/search 夷陵区停车场POI数据
// /HOSPITAL/poi/searchList  夷陵区医院POI
// /GARDEN/poi/searchList  公园信息
// /COMMITTEE/poi/searchList 居委会信息
// /COMPANY/poi/searchList 夷陵区公司数据POI

// /TRANSIT/poi/searchList  公交车站点信息

// /cityfeatureCollection_search/<string:AD_CODE>   市级环线坐标
// /areafeatureCollection_search/<string:AD_CODE>   区县环线坐标
// /Chartdata    夷陵区政府gov图标数据
// /ChartNewsdata   夷陵区政府gov图标下新闻数据
// /SCHOOL/poi/searchList   学校信息
// /Expressway/poi/searchList 高速路口

// /weathernew   实时天气
