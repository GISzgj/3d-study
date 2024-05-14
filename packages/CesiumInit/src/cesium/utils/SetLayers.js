import * as Cesium from 'cesium'
import {
  AmapImageryProvider,
  BaiduImageryProvider,
  TdtImageryProvider,
  TencentImageryProvider
} from '@dvgis/cesium-map'

export class SetLayers {
  constructor(viewer) {
    if (!viewer) {
      throw new Error('必须传入Viewer')
    }
    this.viewer = viewer
    this.ImageryLayerCollection = this.viewer.imageryLayers
    // viewer.imageryLayers.add(amapImageryProvider)
  }
  gdVectorLayer(isChecked) {
    if (isChecked) {
      const gdOptions = {
        style: 'elec', // style: img、elec、cva
        crs: 'WGS84', // 使用84坐标系，默认为：GCJ02
        maximumLevel: 18 // 最大级别
      }
      const amapImageryProvider = new Cesium.ImageryLayer(new AmapImageryProvider(gdOptions))
      this.gdVectorLayerData = this.addLayer(amapImageryProvider)
      console.log('this.gdVectorLayerData', this.gdVectorLayerData)
    } else {
      this.removeLayer(this.gdVectorLayerData)
    }
  }
  bdVectorLayer(isChecked) {
    if (isChecked) {
      const bdOptions = {
        url: 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1',
        crs: 'WGS84' // 使用84坐标系，默认为：BD09
      }
      const bdImageryProvider = new Cesium.ImageryLayer(new BaiduImageryProvider(bdOptions))
      this.bdVectorLayerData = this.addLayer(bdImageryProvider)
    } else {
      this.removeLayer(this.bdVectorLayerData)
    }
  }
  addLayer(imageryProvider) {
    this.ImageryLayerCollection.add(imageryProvider)
    return imageryProvider
  }
  removeLayer(layer) {
    console.log('layer', layer)

    if (layer) {
      this.ImageryLayerCollection.remove(layer, true)
      layer = null
    }
  }
  removeAll() {
    this.ImageryLayerCollection.removeAll()
  }
}
