import * as Cesium from 'cesium'
import RadarLightMaterialProperty from '../material/RadarLightMaterialProperty.js'
import RadarLightMaterial from '../material/RadarLightMaterial.js'

export default class RadarLight {
  constructor(viewer) {
    this.radarMaterial = new RadarLightMaterialProperty()
    this.entity = viewer.entities.add({
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(113.3291, 23.099, 113.3391, 23.109),
        material: this.radarMaterial
        // material: Cesium.Color.RED
      }
    })
  }
}

export class RadarLightPrimitive {
  constructor(viewer) {
    this.radarMaterial = new RadarLightMaterial({
      radians: (Math.PI * 3) / 8,
      offset: 0.2
    })
    const circleGeometry = new Cesium.CircleGeometry({
      radius: 1000,
      center: Cesium.Cartesian3.fromDegrees(113.33, 23.1)
      // vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
    })
    const instance = new Cesium.GeometryInstance({
      geometry: circleGeometry
    })
    const primitive = new Cesium.Primitive({
      geometryInstances: instance,
      appearance: new Cesium.MaterialAppearance({
        material: this.radarMaterial,
        translucent: false
      })
    })
    viewer.scene.primitives.add(primitive)
  }
}
