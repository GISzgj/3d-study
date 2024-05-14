import * as Cesium from 'cesium'
import Bubble from '../popup/bubble.js'
let bubble
/**
 * @description 点击BillboardCollection中的label显示数据,适用于使用primitiveCollection.add(BillboardCollection)添加的点, 需要配套使用popup属性框
 * @param {Object} viewer Cesium构造的viewer
 * @returns handler事件处理程序
 * @example 清除handler.removeAll() handler = null
 */
export const getPoiDataHandler = viewer => {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction(e => {
    const position = viewer.scene.pickPosition(e.position)
    // 问题: '点击的时候回只能在图片的有色区域点击,空隙为undefined'
    const pickObj = viewer.scene.pick(e.position)
    bubble && bubble.windowClose()
    if (!pickObj && !Cesium.defined(pickObj)) return
    if (
      !pickObj.collection ||
      !pickObj.primitive ||
      !(pickObj.collection instanceof Cesium.BillboardCollection)
    )
      return
    const data = pickObj.primitive.data
    if (!data) return console.error('在加载的poi中未获取到数据')
    // 可以根据type来加载不同的popup
    const popupComponentName = data.popupComponentName
    useBubble(viewer, data, position, popupComponentName)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  return handler
}

function useBubble(viewer, properties, position, popupComponentName) {
  bubble && bubble.windowClose()
  bubble = new Bubble(
    {
      position,
      viewer: viewer,
      properties
    },
    popupComponentName
  )
}
