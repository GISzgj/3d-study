import * as Cesium from 'cesium'
import LightWallMaterialProperty from '../material/LightWallProperty'
import LightWallMaterial from '../material/LightWallMaterial'

import gsap from 'gsap'

export default class LightWall {
  constructor(viewer) {
    // 113.3191,23.109,
    // 设置雷达材质
    this.LightWallMaterial = new LightWallMaterialProperty('LightWallMaterial')
    this.entity = viewer.entities.add({
      name: 'lightWall',
      position: Cesium.Cartesian3.fromDegrees(113.3081, 23.101, 200),
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          113.3051, 23.099, 200.0, 113.3101, 23.099, 200.0, 113.3101, 23.104, 200.0, 113.3051,
          23.104, 200.0, 113.3051, 23.099, 200.0
        ]),
        material: this.LightWallMaterial
        // outline: true,
      },
      label: {
        text: '光墙',
        font: '16px sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        // outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -20),
        fillColor: Cesium.Color.WHITE
        // outlineColor: Cesium.Color.BLACK,
      }
    })
  }
}

export class LightWallPrimitive {
  constructor(viewer) {
    this.LightWallMaterial = new LightWallMaterial('LightWallMaterialPrimitive')
    const wall = new Cesium.WallGeometry({
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        113.3051, 23.099, 200.0, 113.3101, 23.099, 200.0, 113.3101, 23.104, 200.0, 113.3051, 23.104,
        200.0, 113.3051, 23.099, 200.0
      ])
      // vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
    })
    const wallInstance = new Cesium.GeometryInstance({
      geometry: wall,
      id: 'lightWallInstance'
    })
    const primitive = new Cesium.Primitive({
      geometryInstances: [wallInstance],
      appearance: new Cesium.MaterialAppearance({
        material: this.LightWallMaterial
      })
    })
    console.log('primitiveisntane', wallInstance)

    viewer.scene.primitives.add(primitive)
    this.entity = viewer.entities.add({
      name: 'lightWall',
      position: Cesium.Cartesian3.fromDegrees(113.3081, 23.101, 200),
      label: {
        text: '光墙',
        font: '16px sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        // outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -20),
        fillColor: Cesium.Color.WHITE
        // outlineColor: Cesium.Color.BLACK,
      }
    })
  }
}
