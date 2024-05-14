import * as Cesium from 'cesium'
import { ElMessageBox } from 'element-plus'
import Bubble from '../popup/bubble.js'
import { useMeasureState } from '@/store/useMeasure.js'
import { useMeasure } from '../utils/cesiumMeasure.js'
let Measure = useMeasure(Cesium)

let bubble
export default class RightMenu {
  constructor(viewer, rightMenu) {
    this.measureState = useMeasureState()
    this.measure = new Measure(viewer)

    this.viewer = viewer
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    this.rightMenu = rightMenu
      ? rightMenu
      : [
          {
            label: '折线测量',
            value: 'lineMeasurement',
            componentName: 'LineMeasurement',
            measure: this.measure
          },
          {
            label: '面积测量',
            value: 'areaMeasurement',
            componentName: 'AreaMeasurement',
            measure: this.measure
          },
          { label: '右键位置', value: 'rigthPosition', componentName: 'RigthPosition' },
          { label: '相机设置', value: 'cameraSetting', componentName: 'CameraSetting' },

          // { label: '雪天模拟', value: 'snow' },
          // { label: '雨天模拟', value: 'rain' },
          { label: '地球自转', value: 'rotation', componentName: 'Rotation' },
          {
            label: '清除测量',
            value: 'ClearMeasurement',
            componentName: 'ClearMeasurement',
            measure: this.measure
          }
        ]
    this.setHandler()
  }
  setHandler() {
    this.handler.setInputAction(e => {
      // 获取鼠标点击位置
      const position = this.viewer.scene.camera.pickEllipsoid(
        e.position,
        this.viewer.scene.globe.ellipsoid
      )
      if (!position) return
      if (this.measureState.isMeasure) return
      bubble && bubble.windowClose()
      useBubble(this.viewer, this.rightMenu, position, 'RightMenu')
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    this.handler.setInputAction(e => {
      // 获取鼠标点击位置
      bubble && bubble.windowClose()
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
  }
}
function useBubble(viewer, properties, position, type) {
  bubble && bubble.windowClose()
  bubble = new Bubble(
    {
      position,
      viewer: viewer,
      properties
    },
    type
  )
}
