import * as Cesium from 'cesium'
import { MaterialProperty } from 'cesium'
import gsap from 'gsap'
export default class BuildingMaterialProperty {
  constructor(name, img) {
    // 修改uniform时，触发事件
    this.definitionChanged = new Cesium.Event()
    this.name = name || 'BuildingMaterialProperty'
    this.img = img || '/texture/Tex_JinShu_02.PNG'
    Cesium.Material._materialCache.addMaterial(this.name, {
      fabric: {
        type: this.name,
        uniforms: {
          uTime: 0,
          image: this.img
        },
        // vec4 colorImage = texture(image, vec2(st.s, st.t));
        // material.diffuse = colorImage.rgb;
        source: `
          czm_material czm_getMaterial(czm_materialInput materialInput) {
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            material.diffuse = vec3(materialInput.st,uTime);
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
    // 返回材质类型
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
