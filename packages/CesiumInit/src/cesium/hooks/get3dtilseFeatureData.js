import * as Cesium from 'cesium'
import Bubble from '@/tool/bubble'
let properties = {}
let bubble
export default function getTilesFeature(viewer, options) {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
  handler.setInputAction(getClickAttribute, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  return handler
}
let lastPickObject
const getClickAttribute = event => {
  let position = viewer.scene.pickPosition(event.position)
  // 获取点击位置处的primitive
  const pickedObject = viewer.scene.pick(event.position)
  bubble && bubble.windowClose()
  if (lastPickObject) {
    lastPickObject.color = Cesium.Color.WHITE.withAlpha(1.0)
    lastPickObject = undefined
  }
  // 没有拾取到模型,返回不做任何操作
  if (!Cesium.defined(pickedObject)) return
  // 拾取到的模型不是3dtileFeature时返回,不做操作
  if (!(pickedObject instanceof Cesium.Cesium3DTileFeature)) return
  // propertyIds 是3dtileFeature的属性即构件的属性，可以获取到feature的属性
  const propertyIds = pickedObject.getPropertyIds()
  lastPickObject = pickedObject
  pickedObject.color = Cesium.Color.WHITE.withAlpha(0.5)
  const length = propertyIds.length
  for (let i = 0; i < length; i++) {
    const propertyId = propertyIds[i]
    let property = {}
    property[propertyId] = pickedObject.getProperty(propertyId)
    let { OID, batchId, ...filterProperty } = property
    Object.assign(properties, filterProperty)
  }
  if (propertyIds[0]) {
    useBubble(properties, position)
  }
}
function useBubble(propertiesValue, position) {
  const PipeInfo = propertiesValue
  bubble && bubble.windowClose()
  bubble = new Bubble({
    position,
    viewer: window.viewer,
    PipeInfo
  })
}
