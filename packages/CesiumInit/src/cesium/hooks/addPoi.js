import * as Cesium from 'cesium'
import { addOneTypePoi } from '@/cesium/utils/useEntityAddPoint.js'
import {
  getParking,
  getHospital,
  getGarden,
  getCommittee,
  getCompany,
  getBusStation
} from '@/api/getPoi.js'
// 在这一层做了数据处理
export class AddPoiClass {
  constructor(viewer) {
    this.viewer = viewer
  }
  getParkingData() {
    return new Promise(async resolve => {
      const data = await getParking()
      const datas = data.map(item => {
        let position = [Number(item.LON), Number(item.LAT)]
        let parking = item.Positions
        const { LAT, LON, Positions, ...data } = item
        // popupComponentName 是手动加上的属性，标识打开哪个弹窗组件
        return { ...data, parking, position, popupComponentName: 'ParkingPopup' }
      })
      resolve(datas)
    })
  }
  getHospitalData() {
    return new Promise(async resolve => {
      const data = await getHospital()
      const datas = data.map(item => {
        let position = [Number(item.LON), Number(item.LAT)]
        const { LAT, LON, Positions, ...data } = item
        return { ...data, position, popupComponentName: 'HospitalPopup' }
      })
      resolve(datas)
    })
  }
  getGardenData() {
    return new Promise(async resolve => {
      const data = await getGarden()
      const datas = data.map(item => {
        let position = [Number(item.LON), Number(item.LAT)]
        const { LAT, LON, Positions, ...data } = item
        return { ...data, position, popupComponentName: 'GardenPopup' }
      })
      resolve(datas)
    })
  }
  getCommitteeData() {
    return new Promise(async resolve => {
      const data = await getCommittee()
      const datas = data.map(item => {
        let position = [Number(item.LON), Number(item.LAT)]
        const { LAT, LON, Positions, ...data } = item
        return { ...data, position, popupComponentName: 'CommitteePopup' }
      })
      resolve(datas)
    })
  }
  getCompanyData() {
    return new Promise(async resolve => {
      const data = await getCompany()
      const datas = data.map(item => {
        let position = [Number(item.LON), Number(item.LAT)]
        const { LAT, LON, Positions, ...data } = item
        return { ...data, position, popupComponentName: 'CompanyPopup' }
      })
      resolve(datas)
    })
  }
  getBusStationData() {
    return new Promise(async resolve => {
      const data = await getBusStation()
      const datas = data.map(item => {
        let position = [Number(item.LON), Number(item.LAT)]
        const { LAT, LON, Positions, ...data } = item
        return { ...data, position, popupComponentName: 'BusStationPopup' }
      })
      resolve(datas)
    })
  }
  async addPoi(type) {
    return new Promise(async resolve => {
      switch (type) {
        case 'parking':
          // 获取停车场数据
          this.getParkingData().then(datas => {
            this.parkingPrimitives = addOneTypePoi(this.viewer, datas, '/parking.svg')
            resolve(this.parkingPrimitives)
          })
          break
        case 'hospital':
          this.getHospitalData().then(datas => {
            this.hospitalPrimitives = addOneTypePoi(this.viewer, datas, '/hospital.svg')
            resolve(this.hospitalPrimitives)
          })
          break
        case 'garden':
          this.getGardenData().then(datas => {
            this.gardenPrimitives = addOneTypePoi(this.viewer, datas, '/garden.svg')
            resolve(this.gardenPrimitives)
          })
          break
        case 'committee':
          this.getCommitteeData().then(datas => {
            this.committeePrimitives = addOneTypePoi(this.viewer, datas, '/committee.svg')
            resolve(this.committeePrimitives)
          })
          break
        case 'company':
          this.getCompanyData().then(datas => {
            this.companyPrimitives = addOneTypePoi(this.viewer, datas, '/company.svg')
            resolve(this.companyPrimitives)
          })
          break
        case 'busStation':
          this.getBusStationData().then(datas => {
            this.busStationPrimitives = addOneTypePoi(this.viewer, datas, '/busStation.svg')
            resolve(this.busStationPrimitives)
          })
          break
        default:
          break
      }
    })
  }
  flyTo(type) {
    let lonLng
    switch (type) {
      case 'parking':
        lonLng = [111.32520913238244, 30.77473938768044]
        break
      case 'hospital':
        lonLng = [111.32537538337517, 30.767166196475014]
        break
      case 'garden':
        lonLng = [111.31888575560198, 30.771015510184572]
        break
      case 'committee':
        lonLng = [111.33376592416977, 30.779488203719442]
        break
      case 'company':
        lonLng = [111.31303914567283, 30.77029489491028]
        break
      case 'busStation':
        lonLng = [111.36579125239987, 30.660289131740203]
        break
      default:
        lonLng = [111.32520913238244, 30.77473938768044]
        break
    }
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(...lonLng, 5000)
    })
  }
  removePoiFromType(type) {
    switch (type) {
      case 'parking':
        this.parkingPrimitives.removeAll()
        this.viewer.scene.primitives.remove(this.parkingPrimitives)
        this.parkingPrimitives = null
        break
      case 'hospital':
        this.hospitalPrimitives.removeAll()
        this.viewer.scene.primitives.remove(this.hospitalPrimitives)
        this.hospitalPrimitives = null
        break
      case 'garden':
        this.gardenPrimitives.removeAll()
        this.viewer.scene.primitives.remove(this.gardenPrimitives)
        this.gardenPrimitives = null
        break
      case 'committee':
        this.committeePrimitives.removeAll()
        this.viewer.scene.primitives.remove(this.committeePrimitives)
        this.committeePrimitives = null
        break
      case 'company':
        this.companyPrimitives.removeAll()
        this.viewer.scene.primitives.remove(this.companyPrimitives)
        this.companyPrimitives = null
        break
      case 'busStation':
        this.busStationPrimitives.removeAll()
        this.viewer.scene.primitives.remove(this.busStationPrimitives)
        this.busStationPrimitives = null
        break
      default:
        break
    }
  }
}
