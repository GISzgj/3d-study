import * as Cesium from 'cesium'
import gsap from 'gsap'
import { Material, MaterialProperty } from 'cesium'

export default class RadarLightMaterial extends Material {
  constructor(options = {}) {
    let params = {
      uTime: 0
    }
    const newOptions = {
      translucent: true,
      fabric: {
        type: 'RadarLightMaterial',
        uniforms: options.uniforms || {
          time: params.uTime ?? 0.0,
          radians: options.radians ?? 0.0,
          color: new Cesium.Color(0, 1, 1),
          sectorColor: options.sectorColor || new Cesium.Color(0, 1, 1),
          offset: options.offset ?? 0.2,
          width: options.width ?? 0.01
        },
        source: `
          uniform float time;
          uniform vec4 color;
          uniform vec4 sectorColor;
          uniform float width;
          uniform float radians;
          uniform float offset;
          czm_material czm_getMaterial(czm_materialInput materialInput){
              czm_material material = czm_getDefaultMaterial(materialInput);
              vec2 st = materialInput.st;
              float dis = distance(st, vec2(0.5));
              float sp = 0.1;
              float m = mod(dis, sp);
              float alpha = step(sp * (1.0 - width * 10.0), m + width / 2.0);
           
              alpha = clamp(alpha, 0.2, 1.0);
              material.alpha = alpha;
              material.diffuse = color.rgb;
        
              // 绘制十字线
              if ((st.s > 0.5 - width / 2.0 && st.s < 0.5 + width / 2.0) || (st.t > 0.5 - width / 2.0 && st.t < 0.5 + width / 2.0)) {
                  alpha = 1.0;
                  material.diffuse = color.rgb;
                  material.alpha = alpha;
              }
              // 绘制光晕
              float ma = mod(dis + offset , 0.5);
              if (ma < 0.25){
                  alpha = ma * 3.0 + alpha;
              } else{
                  alpha = 3.0 * (0.5 - ma) + alpha;
              }                           
              material.alpha = alpha;
              material.diffuse = sectorColor.rgb;
          
              // 绘制扇区
              vec2 xy = materialInput.st;
              float rx = xy.x - 0.5;
              float ry = xy.y - 0.5;
              float at = atan(ry, rx);
              // 半径
              float radius = sqrt(rx * rx + ry * ry);
              // 扇区叠加旋转角度
              float radians_time = radians + time;
              float current_radians = at + radians_time;
              xy = vec2(cos(current_radians) * radius, sin(current_radians) * radius);
              xy = vec2(xy.x + 0.5, xy.y + 0.5);
          
              // 扇区渐变色渲染
              if (xy.y - xy.x < 0.0 && xy.x > 0.5 && xy.y > 0.5){
                  material.alpha = alpha + 0.2;
                  material.diffuse = sectorColor.rgb;
              }
              return material;
          }
          `
      }
    }
    console.log(newOptions)

    // this === material
    const material = super(newOptions)
    gsap.to(params, {
      uTime: Math.PI * 2,
      duration: 2,
      repeat: -1,
      ease: 'linear',
      onUpdate: () => {
        material.uniforms.time = params.uTime
        // this.uniforms.uTime = params.uTime
      }
    })
  }
}
