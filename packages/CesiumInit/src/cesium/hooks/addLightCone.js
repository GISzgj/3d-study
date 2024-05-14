import * as Cesium from 'cesium'
import gsap from 'gsap'

export default class LightCone {
  constructor(viewer) {
    this.params = {
      height: 100,
      degress: 0,
      roolDegess: 0
    }
    //   设置模型位置矩阵
    this.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
      // 位置
      Cesium.Cartesian3.fromDegrees(113.3191, 23.109, this.params.height),
      // 模型旋转情况
      new Cesium.HeadingPitchRoll(this.params.degress, 0, this.roolDegess)
    )
    //   添加模型
    const modelPromise = Cesium.Model.fromGltfAsync({
      url: '/model/pyramid.glb',
      show: true,
      // 设置模型的缩放比例
      scale: 200,
      minimumPixelSize: 12,
      maximumScale: 20000,
      debugShowBoundingVolume: false,
      debugWireframe: false,
      color: Cesium.Color.YELLOW.withAlpha(0.5),
      // 设置颜色的混合模式
      colorBlendMode: Cesium.ColorBlendMode.MIX,
      // 设置模型的位置矩阵
      modelMatrix: this.modelMatrix
    })
    modelPromise.then(res => {
      console.log(res)
      this.model = viewer.scene.primitives.add(res)

      this.animate()
    })
  }
  animate() {
    gsap.to(this.params, {
      height: 100,
      degress: 2 * Math.PI,
      repeat: -1,
      duration: 1,
      ease: 'linear',
      onUpdate: () => {
        this.model.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
          // 位置
          Cesium.Cartesian3.fromDegrees(113.3191, 23.109, this.params.height),
          // 模型旋转情况
          new Cesium.HeadingPitchRoll(this.params.degress, Math.PI / 2, 0)
        )
      }
    })
  }
}
