// http://naturalatlas.github.io/node-gdal/classes/gdal.html
const path = require('path')
const gdal = require('gdal')

/**
 * shapefile转geojson
 * @param {*} shp_path shapefile路径
 * @param {*} jsonOutDir geojson 输入目录
 * @param {*} jsonName geojson文件名，如果为空则为shapefile的文件名
 */
async function shp2geojson(shp_path, jsonOutDir = '.', jsonName = '') {
  if (jsonName == null || jsonName == undefined || jsonName == '') {
    jsonName = path.basename(shp_path).replace('.shp', '.geojson')
  }
  gdal.config.set(
    'GDAL_DATA',
    'C:\\Users\\User\\AppData\\Roaming\\nvm\\v16.20.0\\node_modules\\gdal\\deps\\libgdal\\gdal\\data'
  )
  //为了支持中文路径
  gdal.config.set('GDAL_FILENAME_IS_UTF8', 'YES')
  // 设置GDAL配置为UTF-8编码
  gdal.config.set('SHAPE_ENCODING', 'UTF-8')
  const shpDiver = gdal.drivers.get('ESRI Shapefile')
  if (shpDiver == null || shpDiver == undefined) {
    throw newError('获取Esri Shapefile驱动失败!')
  }
  let geojsonDrive = gdal.drivers.get('GeoJSON')
  if (geojsonDrive == null || geojsonDrive == undefined) {
    throw newError('获取Geojson 驱动失败！')
  }
  try {
    let shpDs = gdal.open(shp_path, 'r', shpDiver.description)
    if (shpDs == null || shpDs == undefined) {
      throw newError('shapefile读取失败')
    }

    const geojsonfile = jsonOutDir + '/' + jsonName
    const result = geojsonDrive.createCopy(geojsonfile, shpDs)
    result.flush()
    result.close()
    console.log('shapefile转geojson转换成功！！！')
    console.log('输出路径为：' + geojsonfile)
    shpDs.flush()
    shpDs.close()
  } catch (error) {
    console.error(error.message)
  } finally {
    geojsonDrive = null
    shpDs = null
  }
}
shp2geojson('./a.shp')
