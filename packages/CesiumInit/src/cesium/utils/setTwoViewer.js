import * as Cesium from 'cesium'
// 分屏对比splitScreen
/**
 * @param {Cesium.Viewer} viewer1 Cesium的Viewer
 * @param {Cesium.Viewer} viewer2 Cesium的Viewer
 * @example  左右球同步
  setManyView(leftMap.viewer,rightMap.viewer)
  setManyView(rightMap.viewer,leftMap.viewer)
 */
function setManyView(viewer1, viewer2) {
  const syncView = () => {
    // 获取另一个viewer的相机视角数据
    const { positionWC, heading, pitch, roll, up, _direction } = viewer2.scene.camera
    // 设置视角
    viewer1.camera.setView({
      destination: positionWC,
      orientation: {
        heading: heading,
        pitch: pitch,
        roll: roll,
        up: up,
        direction: _direction
      }
    })
  }
  // 初始执行一次
  syncView()
  //camera监听函数
  viewer2.camera.changed.addEventListener(syncView)
  //设置触发监听函数的时间
  viewer2.camera.percentageChanged = 0.01
  return () => {
    viewer2.camera.changed.removeEventListener(syncView)
  }
}

export default setManyView
