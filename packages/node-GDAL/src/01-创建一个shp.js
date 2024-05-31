// http://naturalatlas.github.io/node-gdal/classes/gdal.html
const gdal = require('gdal')
gdal.config.set(
  'GDAL_DATA',
  'C:\\Users\\User\\AppData\\Roaming\\nvm\\v16.20.0\\node_modules\\gdal\\deps\\libgdal\\gdal\\data'
)
// 设置GDAL配置为UTF-8编码
gdal.config.set('SHAPE_ENCODING', 'UTF-8')
// 创建一个shp文件
const dataset = gdal.open('./a.shp', 'w', 'ESRI Shapefile')
/* 
新增图层。
create(name, srs, geomType, creation_options)
参数:
name String类型，图层名称。
srs gdal.SpatialReference| Null，图层投影坐标系。
geomType Integer | FunctionGeometry，图层几何类型。
creation_options String[] | Object 特殊选项，可选。
返回值:
gdal.Layer
示例: */
const projection4326 = gdal.SpatialReference.fromEPSGA(4326)
dataset.layers.create('test', projection4326, gdal.Point, [
  'ENCODING=UTF-8' // 设置编码为UTF-8
])
const layer = dataset.layers.get(0)
// 为图层创建一个字段
layer.fields.add(new gdal.FieldDefn('name', gdal.OFTString))
// 添加一个要素- 构建图形并赋值
const feature = new gdal.Feature(layer)
feature.fields.set('name', 'test-测试')
const pt = new gdal.Point(110, 30)
feature.setGeometry(pt)
layer.features.add(feature)
layer.flush()
