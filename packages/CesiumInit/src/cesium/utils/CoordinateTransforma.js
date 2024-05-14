import * as Cesium from 'cesium'
import proj4 from 'proj4'

export class CoordinateTransforma {
  constructor(viewer) {
    this.viewer = viewer
  }
  epsg4546ToWgs84(x, y) {
    // 2000 中央经线111 转到 84
    // x分量和y分量是平面坐标系下的坐标，需要转换成经纬度坐标
    proj4.defs(
      'EPSG:4546',
      '+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs'
    )
    // 经度; 纬度
    const point = proj4('EPSG:4546', 'EPSG:4326', [x, y]) // 将平面坐标转换为经纬度坐标
    return point
  }
}
