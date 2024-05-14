import * as Cesium from 'cesium'
import * as turf from '@turf/turf'
/**
 *
 * @param {*} viewer
 * @param {*} options :{
 *  length: 5,
 *  width: 5,
 *  height: 5,
 * }
 * @example createBoxGeometry(viewer, {center: [113.2171, 23.009], length: 5, width: 5, height: 5, isOutline: false})
 * @returns primitive
 */
const createBoxGeometry = (viewer, options) => {
  const { center, length, width, height, isOutline = false } = options

  // 定义中心
  const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(center[0], center[1], center[2])
  )
  // 定义旋转角度
  const hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(
    new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), 0.0, 0.0) // 中心点水平旋转90度
  )
  // 定义平移
  const hpr = Cesium.Matrix4.fromRotationTranslation(
    hprRotation,
    new Cesium.Cartesian3(0.0, 0.0, 0.0) // 不平移
  )
  Cesium.Matrix4.multiply(modelMatrix, hpr, modelMatrix)
  const boxGeometry = Cesium.BoxGeometry.fromDimensions({
    // 传入位置和法线信息
    vertexFormat: Cesium.VertexFormat.POSITION_AND_NORMAL,
    dimensions: new Cesium.Cartesian3(length, width, height)
  })
  const boxInstance = new Cesium.GeometryInstance({
    geometry: boxGeometry,
    modelMatrix: modelMatrix,
    id: 'boxInstance0',
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
    }
  })
  const boxPrimitive = new Cesium.Primitive({
    geometryInstances: boxInstance,
    appearance: new Cesium.PerInstanceColorAppearance()
  })
  viewer.scene.primitives.add(boxPrimitive)
  return boxPrimitive
}
/**
 * 
 * @param {*} viewer 
 * @param {*} options {positions: [
        104.041991, 22.117029, 12000,
        104.441991, 21.817029, 12000,
        105.041991, 22.817029, 35000,
        104.541991, 23.817029, 12000,
        104.081991, 22.417029, 13000,
    ],width: 5}
  * @example  createPolylineGeometry(viewer, {positions: [113.2171, 23.009, 0, 113.2171, 23.209, 0, 113.4191, 23.209, 0, 113.4191, 23.009, 0],
      width: 5
      })
 */
const createPolylineGeometry = (viewer, options) => {
  const { positions, width = 5 } = options
  const ps = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
  const polylineGeometry = new Cesium.PolylineGeometry({
    positions: ps,
    width: width,
    vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
  })
  const polylineInstance = new Cesium.GeometryInstance({
    geometry: polylineGeometry,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
    }
  })
  const primitive = new Cesium.Primitive({
    geometryInstances: polylineInstance,
    appearance: new Cesium.PolylineColorAppearance({
      translucent: false
    })
  })
  return viewer.scene.primitives.add(primitive)
}
/**
 *
 * @param {*} viewer
 * @param {*} options
 * @example createPolygonGeometry(viewer, {
 *  positions: [113.2171, 23.009, 0, 113.2171, 23.209, 0, 113.4191, 23.209, 0, 113.4191, 23.009, 0],
 *  extrudedHeight: 0
 * })
 * @returns
 */
const createPolygonGeometry = (viewer, options) => {
  const { positions, extrudedHeight = 0 } = options
  const ps = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
  const polygonGeometry = new Cesium.PolygonGeometry({
    polygonHierarchy: new Cesium.PolygonHierarchy(ps),
    extrudedHeight
  })
  const polygonInstance = new Cesium.GeometryInstance({
    geometry: polygonGeometry,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
    }
  })
  const primitive = new Cesium.Primitive({
    geometryInstances: polygonInstance,
    appearance: new Cesium.PerInstanceColorAppearance()
  })
  return viewer.scene.primitives.add(primitive)
}
const createLabelPrimitive = (viewer, options) => {}
export { createBoxGeometry, createPolylineGeometry, createPolygonGeometry }
