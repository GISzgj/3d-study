import * as Cesium from 'cesium'
import gsap from 'gsap'

export default class LightLineMaterialProperty {
  constructor(name, img) {
    this.name = name || 'LightLineMaterialProperty'
    this.img = img || '/texture/spriteline3.png'
    this.definitionChanged = new Cesium.Event()
    Cesium.Material._materialCache.addMaterial(this.name, {
      fabric: {
        type: this.name,
        uniforms: {
          uTime: 0,
          image: this.img
        },
        source: `
          czm_material czm_getMaterial(czm_materialInput materialInput) {
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            vec4 colorImage = texture(image, vec2(fract(st.s - uTime), st.t));
            material.alpha = colorImage.a;
            material.diffuse = colorImage.rgb;
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
