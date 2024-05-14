import * as Cesium from 'cesium'
/**
 * 地形开启开关
 * @param {*} viewer
 * @param {object} options  传递flag标识是否开启; terrianUrl: 地址
 * @returns
 */
export function loadTerrain(viewer, options) {
  const { flag, terrianUrl } = options
  if (!terrianUrl) {
    console.error('terrianUrl is required')
    return
  }
  if (flag) {
    // ./3-0-8版本地形切片111/       ====> api会自动添加为 ./3-0-8版本地形切片111/layer.json
    let terrainProvider = Cesium.CesiumTerrainProvider.fromUrl(terrianUrl, {
      requestVertexNormals: true
    })
    terrainProvider.then(res => {
      viewer.terrainProvider = res
    })
  } else {
    viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({})
  }
}
/**
 *
 * @param {*} viewer
 * @param {Object} options {flag: 表示打开还是关闭}
 */
export function loadDefaultTerrain(viewer, options) {
  const { flag } = options
  const terrain = new Cesium.Terrain.fromWorldTerrain()
  if (flag) {
    viewer.scene.setTerrain(terrain)
    terrain.readyEvent.addEventListener(provider => {
      viewer.scene.globe.enableLighting = true
      terrain.provider.errorEvent.addEventListener(error => {
        alert(`Encountered an error while loading terrain tiles! ${error}`)
      })
    })
    terrain.errorEvent.addEventListener(error => {
      alert(`Encountered an error while creating terrain! ${error}`)
    })
  } else {
    viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({})
    viewer.scene.globe.enableLighting = false
  }
}
/**
 * 地表是否透明
 * @param {*} viewer
 * @param {object} options {
 *  flag: 表示是否透明
 * }
 */
export function openSurfaceTransparent(viewer, options) {
  // 是否开启深度测试;关闭情况下地表透明
  const { flag } = options
  if (flag) {
    viewer.scene.globe.depthTestAgainstTerrain = false // 关闭深度测试; 地表透明
  } else {
    viewer.scene.globe.depthTestAgainstTerrain = true // 开启深度测试; 地表不透明
  }
}

// const servicesUrl = [
//   {
//     name: '天地图地图',
//     url: 'https://t{s}.tianditu.gov.cn/' + 'DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + tianDIKey,
//     subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
//     options: {
//       style: 'vec',
//       crs: 'WGS84',
//       key: tianDIKey
//     },
//     provider: 'TdtImageryProvider'
//   },
//   {
//     name: '天地图影像',
//     url: 'https://t{s}.tianditu.gov.cn/' + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + tianDIKey,
//     subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
//     options: {
//       style: 'img', // style: img、elec、cva
//       crs: 'WGS84', // 使用84坐标系，默认为：GCJ02,
//       key: tianDIKey
//     },
//     provider: 'TdtImageryProvider'
//   },
//   {
//     name: '天地图注记',
//     url: 'https://t{s}.tianditu.gov.cn/' + 'DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + tianDIKey,
//     subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
//     options: {
//       style: 'cva',
//       crs: 'WGS84',
//       key: tianDIKey
//     },
//     provider: 'TdtImageryProvider'
//   },
//   {
//     name: '百度道路地图',
//     options: {
//       style: 'traffic',
//       crs: 'WGS84'
//     },
//     provider: 'BaiduImageryProvider'
//   },
//   {
//     name: '百度影像地图',
//     options: {
//       style: 'img',
//       crs: 'WGS84'
//     },
//     provider: 'BaiduImageryProvider'
//   },
//   {
//     name: '腾讯地图',
//     options: {
//       style: 'img' //style: img、1：经典
//     },
//     provider: 'TencentImageryProvider'
//   },
//   {
//     name: '腾讯标准地图',
//     options: {
//       style: 1 //style: img、1：经典
//     },
//     provider: 'TencentImageryProvider'
//   }
// ]
