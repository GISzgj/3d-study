import * as Cesium from 'cesium'

/**
 *
 * @abstract 加载天地图的影像图层
 * @param {*} viewer
 */
export function loadTdImagerys(viewer) {
  const tdToken = '671e380fb46a9a6412e5dd93417410ce'
  const imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t0.tianditu.gov.cn/img_w/wmts?tk=' + tdToken,
    layer: 'img',
    style: 'default',
    format: 'tiles',
    maximumLevel: 18,
    tileMatrixSetID: 'w'
  })
  return viewer.imageryLayers.addImageryProvider(imageryProvider)
}
/**
 * @abstract 加载ArcGIS影像图层
 * @param {*} viewer
 * @returns
 */
export function loadArcGISImagerys(viewer) {
  const imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS',
    layer: 'World_Imagery',
    style: 'default',
    format: 'image/jpeg',
    tileMatrixSetID: 'GoogleMapsCompatible',
    maximumLevel: 16,
    credit: new Cesium.Credit('© Esri', 'https://www.esri.com/')
  })
  return viewer.imageryLayers.addImageryProvider(imageryProvider)
}
/**
 * @abstract 加载GeoServer的发布的tif数据
 * @param {*} viewer
 * @param {String} layers geoserver发布服务的 工作区名：图层名
 * @returns
 */
export function loadGeoServerTifMap(viewer, layers) {
  const resource = new Cesium.Resource({
    url: 'http://10.0.22.110:8090/geoserver/cesium/wms'
  })
  var provider = new Cesium.WebMapServiceImageryProvider({
    //创建一个图层（geoserver中的tif）
    url: resource, // geoserver服务地址
    layers, // 工作区名：图层名
    parameters: {
      service: 'WMS',
      format: 'image/png',
      srs: 'EPSG:4326', // 坐标系
      transparent: true,
      version: 1.1
    }
  })
  return viewer.imageryLayers.addImageryProvider(provider)
}
