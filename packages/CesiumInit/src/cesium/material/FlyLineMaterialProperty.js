import * as Cesium from 'cesium'
import gsap from 'gsap'

export default class FlyLineMaterialProperty {
  constructor(name) {
    this.name = name || 'FlyLineMaterialProperty'
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
            float time = fract(czm_frameNumber / (60.0*5.0));
            time = time * (1.1);
            float a = smoothstep(time - 0.1, time, st.s) * step(-time, -st.s);
            a += 0.05;
            material.alpha = a;
            material.diffuse = vec3(1.0);
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
    return other instanceof LightLineMaterialProperty && other.name === this.name
  }
}
