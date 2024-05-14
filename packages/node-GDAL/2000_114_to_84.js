const gdal = require('C:\\Users\\User\\AppData\\Roaming\\nvm\\v16.20.0\\node_modules\\gdal')
console.log('GDAL Version:', gdal.version)
// 输入和输出文件路径
const inputFilePath = 'D:\\proj3\\jk-GuangGuCenter\\data\\基地正射\\基地正射_无水印.tif'
const outputFilePath = 'data/output.tif'
// 打开输入文件
const dataset = gdal.open(inputFilePath)

if (!dataset) {
  console.error('Failed to open input file.')
  process.exit(1)
}
// 创建输出数据集
const driver = gdal.drivers.get('GTiff')
const outputDataset = driver.create(
  outputFilePath,
  dataset.rasterSize.x,
  dataset.rasterSize.y,
  1,
  gdal.GDT_Float32
)

if (!outputDataset) {
  console.error('Failed to create output dataset.')
  process.exit(1)
}

// 设置投影信息
const epsg = '+proj=longlat +datum=WGS84 +no_defs +type=crs' // WGS84的EPSG代码
outputDataset.srs = gdal.SpatialReference.fromProj4(epsg) // 设置输出数据集的投影为WGS84

// 执行重投影
const warpOptions = {
  src: dataset,
  dst: outputDataset,
  format: 'GTiff',
  options: {
    resampleAlg: gdal.GRA_NearestNeighbour, // 重采样算法
    srcSRS: dataset.srs,
    dstSRS: outputDataset.srs
  }
}
gdal.reprojectImage(warpOptions, err => {
  if (err) {
    console.error('Reprojection failed:', err)
    process.exit(1)
  }

  console.log('Reprojection successful.')
})
