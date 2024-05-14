import * as Cesium from 'cesium'

// import { CustomMaterialProperty } from '../material/PolyLineMaterialProperty'
import PolyLineMaterialProperty from '../material/PolyLineMaterialProperty'

export default class RoadLightLine {
  constructor(viewer, options) {
    this.viewer = viewer
    this.name = options.name || 'LightLineMaterialProperty'
    this.img = options.img || '/texture/spriteline3.png'
    this.url = options.url
    if (this.url) {
      this.source = this.loadGeoJson(this.url, this.name, this.img)
    }
  }
  async loadGeoJson(url, name, img) {
    const dataSource = await Cesium.GeoJsonDataSource.load(url)
    const entities = dataSource.entities.values
    let polyLineMaterialProperty = new PolyLineMaterialProperty(name, img)
    entities.forEach(item => {
      item.polyline.material = polyLineMaterialProperty
    })
    return this.viewer.dataSources.add(dataSource)
  }
  toggleShow() {
    if (this.source) {
      this.source.then(item => {
        item.show = !item.show
      })
      return this.source
    }
  }
}
