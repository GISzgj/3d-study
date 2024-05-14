import * as Cesium from 'cesium'
import LightSpreadMaterialProperty from '../material/LightSpreadMaterialProperty.js'
import gsap from 'gsap'
export default class LightSpread {
  constructor(viewer) {
    this.lightSpreadMaterial = new LightSpreadMaterialProperty()
    console.log(this.lightSpreadMaterial)
    this.param = {
      minlot: 113.3091,
      minLat: 23.119,
      maxlot: 113.3141,
      maxLat: 23.124
    }
    this.entity = viewer.entities.add({
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(113.3091, 23.119, 113.3141, 23.124),
        material: this.lightSpreadMaterial
      }
    })
    this.lightSpread()
  }
  lightSpread() {
    gsap.to(this.param, {
      minlot: 113.2091,
      minLat: 23.019,
      maxlot: 113.4141,
      maxLat: 23.224,
      duration: 5,
      repeat: -1,
      ease: 'linear',
      onUpdate: () => {
        this.entity.rectangle.coordinates = Cesium.Rectangle.fromDegrees(
          this.param.minlot,
          this.param.minLat,
          this.param.maxlot,
          this.param.maxLat
        )
      }
    })
  }
}
