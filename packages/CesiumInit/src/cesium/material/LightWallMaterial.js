import * as Cesium from 'cesium'
import gsap from 'gsap'
import { Material, MaterialProperty } from 'cesium'

export default class LightWallMaterial extends Material {
  constructor(options) {
    let params = {
      uTime: 0
    }
    const newOptions = {
      fabric: {
        type: options.type || 'LightWallMaterial',
        uniforms: {
          uTime: params.uTime,
          image: '/texture/spriteline2.png'
        },
        source: `

          czm_material czm_getMaterial(czm_materialInput materialInput)
          {
            // 生成默认的基础材质
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            // 根据uv采样颜色,fract函数，保留小数部分fract(1.0 - st.x + uTime )
            vec4 color = texture(image, vec2(fract(1.0 - st.y + uTime) ,0.0 ));
            material.diffuse = color.rgb;
            material.alpha = color.a;
            return material;
          }
          `
      }
    }
    // this === material
    const material = super(newOptions)
    gsap.to(params, {
      uTime: 1,
      duration: 2,
      repeat: -1,
      ease: 'linear',
      onUpdate: () => {
        material.uniforms.uTime = params.uTime
        // this.uniforms.uTime = params.uTime
      }
    })
  }
}
