import * as Cesium from 'cesium'
/**
 * cesium-navigation-es6 要在main中注册
 * 加载cesiumNavigation 指南针
 * @param {object} options
 * @returns 挂载完成
 * // // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和Cesium.Rectangle.
// options.defaultResetView = Cesium.Cartographic.fromDegrees(115, 30, 2000000)
// // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
// options.enableCompass = true
// // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件 将不会添加到地图中。
// options.enableZoomControls = true
// // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
// options.enableDistanceLegend = true
// // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
// options.enableCompassOuterRing = true
 */
export default function loadCesiumNavication(options) {
  if (!options.viewer) {
    throw new Error('cesium-navigation-es6 要传入viewer')
  }
  options = options ? options : {}
  const {
    defaultResetView = Cesium.Cartographic.fromDegrees(115, 30, 2000000),
    enableCompass = true,
    enableZoomControls = true,
    enableDistanceLegend = true,
    enableCompassOuterRing = true
  } = options
  const config = {
    defaultResetView,
    enableCompass,
    enableZoomControls,
    enableDistanceLegend,
    enableCompassOuterRing
  }
  window.CesiumNavigation(options.viewer, config)
}
