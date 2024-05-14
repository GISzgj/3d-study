import * as Cesium from 'cesium'

// 地球自转关键代码
/**
 *
 * @param {Object} viewer Cesium的viewer
 * @param {Number} speed 地球自转速度; 相机旋转速度
 * @example 
         viewer.clock.shouldAnimate = true // 开启动画
         viewer.isRotation = true // 自定义属性   
         selfRotate(viewer,2.5)
 */
export function selfRotate(viewer, speed) {
  speed = speed || 1
  let prev = viewer.clock.currentTime
  const icrf = () => {
    const { camera, clock, scene } = viewer
    if (
      viewer.scene.mode !== Cesium.SceneMode.SCENE3D ||
      !viewer.isRotation ||
      !clock.shouldAnimate
    ) {
      prev = clock.currentTime
      return
    }
    const { height } = scene.globe.ellipsoid.cartesianToCartographic(camera.position)
    const a = (465.2 / (6371 * 1000)) * (height + 6371 * 1000)
    const { currentTime } = viewer.clock
    const interval = Cesium.JulianDate.toDate(currentTime) - Cesium.JulianDate.toDate(prev)
    prev = currentTime
    viewer.camera.rotate(
      Cesium.Cartesian3.UNIT_Z,
      a * (Math.PI / (24 * 60 * 60)) * (interval / 1000) * speed
    )
  }
  viewer.clock.onTick.addEventListener(icrf)
  window.addEventListener('click', () => {
    if (viewer.isRotation) {
      viewer.isRotation = false
    }
  })
}
