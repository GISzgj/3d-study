import * as Cesium from 'cesium'
// 使用BillboardCollection 简单加载点位数据
// 或者使用useGeoServerAddPoint.js 在服务器渲染的点数据
/**
 *
 * @param {Object} viewer Cesium的viewer
 * @param {Array} datas 数据集合
 * @param {String} img 加载广告牌的img 地址
 * @returns
 */
export const addOneTypePoi = (viewer, datas, img) => {
  const billboards = new Cesium.BillboardCollection()
  const length = datas.length
  for (let i = 0; i < length; i++) {
    const item = datas[i]
    // const [position,...data] = item
    const billboard = billboards.add({
      position: new Cesium.Cartesian3.fromDegrees(...item.position, 0),
      image: img,
      id: item.id,
      width: 40,
      height: 31,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    })
    billboard.data = item
  }
  const billboardsPrimitive = viewer.scene.primitives.add(billboards)
  return billboardsPrimitive
}
