import * as Cesium from 'cesium'
import { CoordinateTransforma } from '../utils/CoordinateTransforma.js'
import BuildingMaterialProperty from '../material/BuildingMaterialProperty.js'
import FlyLineMaterialProperty from '../material/FlyLineMaterialProperty.js'
import * as turf from '@turf/turf'
// 添加白膜数据.
export function initWhiteData(viewer) {
  const coordinateTransforma = new CoordinateTransforma(viewer)
  const height = 5.0
  // const position = epsg4546ToWgs84(531257.236361, 3406352.246782)
  // CGCS2000 / 3-degree Gauss-Kruger CM 111E
  const position = coordinateTransforma.epsg4546ToWgs84(531257.236361, 3406352.246782)
  const gltfPosition = Cesium.Cartesian3.fromDegrees(position[0], position[1], height)
  const heading = Cesium.Math.toRadians(0)
  const pitch = Cesium.Math.toRadians(0)
  const roll = 0
  const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(gltfPosition, hpr)
  const customShader = new Cesium.CustomShader({
    fragmentShaderText: `
    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
      float time  = fract(czm_frameNumber/(60.0*10.0));
      time = abs(time-0.5)*2.0;
      material.diffuse = vec3(1.0,0.0, time);
      material.alpha = 0.5;
    }
    `
  })
  // const entity = loadGlb(viewer, gltfPosition, orientation, customShader)
  // viewer.scene.preRender.addEventListener(function (scene, time) {
  //   // 打印czm_frameNumber的值
  //   console.log('Frame Number:', scene.frameState.frameNumber)
  // })
  // console.log(entity.model._customShader)
  const dataSource = loadGeoJson(viewer, '/geojson/building.geojson', customShader)

  // viewer.zoomTo(dataSource)
  // addEntity(viewer)
  createRandomPoints(viewer)
  // entity.model._customShader = customShader
  return dataSource
}

function loadGlb(viewer, gltfPosition, orientation, customShader) {
  return viewer.entities.add({
    position: gltfPosition,
    orientation: orientation,
    name: 'WhiteBuilding',
    id: 'WhiteBuilding',
    model: {
      uri: '/夷陵区(3).glb',
      color: Cesium.Color.fromCssColorString('#ccc'),
      customShader
    }
  })
}

async function loadGeoJson(viewer, url, customShader) {
  const dataSource = await Cesium.GeoJsonDataSource.load(url)
  const entities = dataSource.entities.values
  const floorHeight = 4.5
  const buildingMaterial = new BuildingMaterialProperty()
  entities.forEach(item => {
    const properties = item.properties.getValue(Cesium.JulianDate.now())
    const floorNum = properties['楼层']
    item.polygon.extrudedHeight = floorNum * floorHeight
    item.polygon.outline = false
    item.polygon.fill = true
    item.polygon.show = true
    // item.polygon.material = Cesium.Color.fromCssColorString('rgba(56,136,210,1.0)')
    item.polygon.material = buildingMaterial
  })
  return viewer.dataSources.add(dataSource)
}

function addEntity(viewer) {
  const buildingMaterial = new BuildingMaterialProperty()
  const result = viewer.entities.add({
    // polygon: {
    //   // hierarchy: Cesium.Cartesian3.fromDegreesArray([
    //   //   111.37574094148827, 30.77829011069301, 111.37483756040447, 30.765008482354506,
    //   //   111.40211326405245, 30.781905158393684, 111.38324276926959, 30.809321448414646
    //   // ]),
    //   hierarchy: Cesium.Cartesian3.fromDegreesArray([90, 30, 90, 40, 120, 40, 120, 30]),

    //   height: 0,
    //   // material: Cesium.Color.RED.withAlpha(0.5),
    //   material: buildingMaterial,
    //   outline: true,
    //   outlineColor: Cesium.Color.BLACK
    // }
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(
        90.37574094148827,
        30.77829011069301,
        111.37483756040447,
        42.765008482354506
      ),
      height: 0,
      material: buildingMaterial,
      outline: true
    }
  })
  return result
}

function createRandomPoints(viewer, num = 250) {
  const bbox = [113.2171, 23.009, 113.4191, 23.209]
  const points = turf.randomPoint(num, { bbox })
  console.log(points)
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(113.3401, 23.1101, 10000)
  })
  const flyLineMaterialProperty = new FlyLineMaterialProperty()
  const features = points.features
  features.forEach(item => {
    const coordinates = item.geometry.coordinates
    let start = Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], 0)
    let end = Cesium.Cartesian3.fromDegrees(
      coordinates[0],
      coordinates[1],
      200 + Math.random() * 5000
    )
    const line = viewer.entities.add({
      polyline: {
        positions: [start, end],
        width: 2,
        material: flyLineMaterialProperty
      }
    })
  })
}
