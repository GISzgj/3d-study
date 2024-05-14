import * as Cesium from 'cesium'
const loadOGCService = (viewer, wmsData) => {
  const { url, layers, service, format, srs, crs, credit } = wmsData
  const ogcLayer = new Cesium.WebMapServiceImageryProvider({
    url, // geoserver服务地址
    layers, // 工作区名：图层名
    credit,
    parameters: {
      service,
      format,
      srs,
      crs,
      transparent: true
    }
  })
  const wmsImageryLayer = viewer.imageryLayers.addImageryProvider(ogcLayer)
  return wmsImageryLayer
}
export const addOGCService = (viewer, callback) => {
  const parkingOption = {
    url: `http://10.0.33.81:8600/geoserver/cim_traffic/wms?`,
    layers: 'cim_traffic:Parking_POI',
    service: 'WMS',
    format: 'image/png',
    srs: 'EPSG:4326',
    crs: 'EPSG:4326',
    credit: ''
  }
  const wmsImageryLayer = loadOGCService(viewer, parkingOption)
  if (callback) return callback(wmsImageryLayer)
  else return wmsImageryLayer
}
