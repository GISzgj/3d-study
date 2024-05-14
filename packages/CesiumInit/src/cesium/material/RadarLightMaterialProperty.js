import * as Cesium from 'cesium'
import gsap from 'gsap'

// 雷达
export default class RadarLightMaterialProperty {
  constructor(name) {
    this.name = name || 'RadarLightMaterialProperty'
    this.definitionChanged = new Cesium.Event()
    Cesium.Material._materialCache.addMaterial(this.name, {
      fabric: {
        type: this.name,
        uniforms: {
          uTime: 0
        },
        source: `
          czm_material czm_getMaterial(czm_materialInput materialInput) {
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            // 画圆， 矩形  外部透明；内部不透明
            float alpha = step(distance(vec2(0.5, 0.5), st), 0.5);
            // 根据角度来设置圆透明的强弱
            float angle = atan(st.y, st.x);
            alpha = alpha * angle;
            material.alpha = alpha;
            material.diffuse = vec3(0.5);
            return material;
          }
        `
      },
      translucent: true
    })
    this.isConstant = false
    this.params = {
      uTime: 0
    }
    gsap.to(this.params, {
      uTime: 1,
      duration: 2,
      repeat: -1,
      ease: 'linear'
    })
  }
  getType() {
    return this.name
  }
  getValue(time, result) {
    // console.log('result', result)
    // result值为传给uniform的值
    result.uTime = this.params.uTime
    return result
  }
  equals(other) {
    return other instanceof RadarLightMaterialProperty && other.name === this.name
  }
}
