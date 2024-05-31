const path = require('path')
const gdal = require('gdal')
/** * 将geojson文件转换为shapefile
 * @param {*} geojson_path geojson全路径
 * @param {*} shpOutdir shp文件输出路径
 * @param {*} shp_name shp文件名称，如果不输出则使用geojson的文件名。
 */
async function geojson2shp(geojson_path, shpOutdir = '.', shp_name = '') {
  if (shp_name == null || shp_name == undefined || shp_name == '') {
    shp_name = path.basename(geojson_path).replace('.geojson', '.shp')
  }
  gdal.config.set(
    'GDAL_DATA',
    'C:\\Users\\User\\AppData\\Roaming\\nvm\\v16.20.0\\node_modules\\gdal\\deps\\libgdal\\gdal\\data'
  )
  //为了支持中文路径
  gdal.config.set('GDAL_FILENAME_IS_UTF8', 'YES')
  // 设置GDAL配置为UTF-8编码
  // gdal.config.set('SHAPE_ENCODING', 'UTF-8')
  gdal.config.set('SHAPE_ENCODING', '')
  let shpDiver = gdal.drivers.get('ESRI Shapefile')
  if (shpDiver == null || shpDiver == undefined) {
    throw new Error('获取Esri Shapefile驱动失败!')
  }
  let geojsonDrive = gdal.drivers.get('GeoJSON')
  if (geojsonDrive == null || geojsonDrive == undefined) {
    throw new Error('获取Geojson 驱动失败！')
  }
  try {
    const jsonDs = gdal.open(geojson_path, 'r', geojsonDrive.description)
    const shpfile = shpOutdir + '/' + shp_name
    // ['ENCODING=UTF-8']
    const result = shpDiver.createCopy(shpfile, jsonDs, ['ENCODING=UTF-8'])
    result.flush()
    result.close()
    console.log('转换Shape file 成功--手动确定一下文字编码格式')
    shpDiver = null
    jsonDs.flush()
    jsonDs.close()
  } catch (err) {
    console.error(err.message)
  }
}
geojson2shp('./a.geojson', '.', 'b.shp')
