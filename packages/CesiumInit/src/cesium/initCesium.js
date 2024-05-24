import * as Cesium from 'cesium'
import { SetLayers } from './utils/SetLayers.js'
import { modifyMap } from './utils/modifyMap.js'
import { getPoiDataHandler } from './hooks/getPoiData.js'
import RightMenu from './hooks/RightMenu.js'
import { selfRotate } from './utils/selfRotate.js'
import { initWhiteData } from './hooks/addWhiteGlb.js'
import RadarLight from './hooks/addRadarLight.js'
import { RadarLightPrimitive } from './hooks/addRadarLight.js'
import addWall from './hooks/addWall.js'
import { LightWallPrimitive } from './hooks/addWall.js'
import addLightSpread from './hooks/addLightSpread.js'
import addLightCone from './hooks/addLightCone.js'
import loadCesiumNavication from './utils/useCesiumNavication.js'
import {
  createBoxGeometry,
  createPolylineGeometry,
  createPolygonGeometry
} from './hooks/addGeometryPrimitive.js'

/**
 * @param {String} containerHtml Dom元素的id号
 */
export const initCesium = containerHtml => {
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZjRiYmQ5MC03MmY3LTQ3ZjUtYmNhZi1kNDBjMWM0MTEzMTAiLCJpZCI6MTU4Mzk4LCJpYXQiOjE2OTExMTcxMTl9.KV6W1me5UaKL1aaBrz1o1mR7AH5TaxBrE38a_m4qEs0'
  // 设置cesium默认视角

  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
    // 西边的经度
    89.5,
    // 南边维度
    20.4,
    // 东边经度
    110.4,
    // 北边维度
    61.2
  )
  // Viewer是一切API的开始
  const viewer = new Cesium.Viewer(containerHtml, {
    // mapProjection: new Cesium.GeographicProjection(), // 使用的是高斯克吕格经纬度投影
    animation: false, //是否显示动画控件
    timeline: false, //是否显示时间轴控件
    infoBox: false, // 点击弹出的消息
    selectionIndicator: false, // 点击选择框
    baseLayerPicker: false, //是否显示图层选择控件
    fullscreenButton: false, //是否显示全屏按钮
    geocoder: false, //是否显示搜索按钮
    homeButton: false, //是否显示主页按钮
    navigationHelpButton: false, //是否显示帮助提示按钮
    sceneModePicker: false, //是否显示投影方式按钮
    shouldAnimate: true,
    // 隐藏默认图层，显示为蓝色地球
    imageryProvider: false
  })
  viewer.scene.globe.enableLighting = true
  // 取消天空盒显示
  viewer.scene.skyBox.show = false
  // 设置背景为黑色
  viewer.scene.backgroundColor = Cesium.Color.BLACK
  // 设置抗锯齿
  viewer.scene.postProcessStages.fxaa.enabled = true
  // 设置图层
  const layer = new SetLayers(viewer)
  layer.gdVectorLayer(true)
  viewer.clock.shouldAnimate = true // 开启动画
  viewer.isRotation = false // 自定义属性
  selfRotate(viewer, 2.5)
  // 颜色反转，过滤，修改
  modifyMap(viewer, { invertColor: true, filterObjRGB: { r: 70, g: 100, b: 150 } })
  // 添加poi
  // const addPoiClass = new AddPoiClass(viewer)
  // addPoiClass.addPoi('parking').then(res => {
  //   console.log(res)
  // })
  const leftClickHandler = getPoiDataHandler(viewer)
  const rightMenu = new RightMenu(viewer)

  // 添加白膜数据
  const whiteData = initWhiteData(viewer)
  whiteData.show = false
  // 添加雷达
  const radar = new RadarLight(viewer)
  const r2 = new RadarLightPrimitive(viewer)
  // const wall = new addWall(viewer)
  const wall2 = new LightWallPrimitive(viewer)
  // const lightSpread = new addLightSpread(viewer)
  // const lightCone = new addLightCone(viewer)
  const a = createBoxGeometry(viewer, {
    length: 5000,
    width: 5000,
    height: 5000,
    center: [113.2171, 23.009, 10000]
  })
  const bbox = [113.2171, 23.009, 0, 113.2171, 23.209, 0, 113.4191, 23.209, 0, 113.4191, 23.009, 0]
  loadCesiumNavication({
    viewer: viewer,
    enableCompass: false,
    enableZoomControls: false
  })
  createPolylineGeometry(viewer, {
    positions: bbox,
    width: 5
  })
  return viewer
}
