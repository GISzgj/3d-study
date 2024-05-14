<template>
  <div class="search">
    <a-dropdown>
      <a class="ant-dropdown-link" @click.prevent>
        {{ currentPOI.name }}
        <svg-icon name="dropdown"></svg-icon>
      </a>
      <template #overlay>
        <a-menu @click="getCurrentPOI">
          <a-menu-item v-for="(item, index) in searchPoi" :key="index">
            <a href="javascript:;">{{ item.description }}</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-select
      v-model:value="searchValue"
      show-search
      style="width: 200px"
      :default-active-first-option="false"
      :show-arrow="false"
      :filter-option="false"
      :not-found-content="null"
      :options="searchData"
      @search="handleSearch"
      @select="handleChange"
      @inputKeyDown="handleInputKeyDown"
    ></a-select>
  </div>
</template>
<script setup>
  import { getPositionOfPoi } from '@/api/searchPoi.js'
  import * as Cesium from 'cesium'
  import Bubble from '@/cesium/popup/bubble.js'
  let isComposition = false
  const searchValue = ref()
  const currentPOI = ref({
    name: '选择兴趣点',
    value: 'committee'
  })
  const searchPoi = ref([
    { description: '居委会POI', type: 'committee' },
    { description: '停车场POI', type: 'parking' },
    { description: '公园POI', type: 'garden' },
    { description: '医院POI', type: 'hospital' },
    { description: '公司POI', type: 'company' },
    { description: '公交站点', type: 'busStation' }
  ])
  const searchData = ref([])
  const getCurrentPOI = val => {
    const index = val.key
    currentPOI.value.value = searchPoi.value[index].type
    currentPOI.value.name = searchPoi.value[index].description
  }
  let timeout
  const handleSearch = val => {
    // isComposition 执行时机不对, 因此需要加一个定时器
    if (val === '') return
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    const getData = async () => {
      if (isComposition) return

      const param = {
        type: currentPOI.value.value,
        value: val
      }

      const result = await getPositionOfPoi(param)
      if (result.code !== 200) return console.error('获取数据出错')
      const data = result.result.data
      const newData = data.map(item => {
        const position = [Number(item.LON), Number(item.LAT)]
        return {
          value: position,
          label: item.NAME
        }
      })
      searchData.value = newData
    }
    timeout = setTimeout(getData, 300)
  }
  const handleInputKeyDown = e => {
    e.target.addEventListener('compositionstart', compositionListener)
    e.target.addEventListener('compositionend', compositionListener)
  }
  const compositionListener = e => {
    isComposition = e.type === 'compositionstart'
  }
  const handleChange = (value, key) => {
    searchValue.value = key.label
    currentPOI.value.name = '选择兴趣点'
    currentPOI.value.value = 'committee'
    // 飞行事件
    const position = value
    flyTo(position)
  }
  const flyTo = position => {
    const viewer = window.viewer
    const positionC3 = Cesium.Cartesian3.fromDegrees(...position, 1000)
    console.log(positionC3)
    const entity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(...position, 0),
      point: {
        pixelSize: 40,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
      }
    })
    viewer.camera.flyTo({
      destination: positionC3,
      duration: 0.5,
      complete: () => {
        // 注意经纬度转p3时不能有高度
        const p3 = Cesium.Cartesian3.fromDegrees(...position)
        // 模拟点击事件
        const windowPosition = viewer.scene.cartesianToCanvasCoordinates(p3)
        setTimeout(() => {
          viewer.entities.remove(entity)
        }, 5000)
      }
    })
  }
</script>
<style lang="scss" scoped>
  .search {
    display: flex;
    justify-content: space-between;
    position: relative;
    pointer-events: auto;
    height: 40px;
  }
</style>
<style>
  .search .ant-select .ant-select-selector {
    /* background-color: #faab6b; */
    /* border: #faab6b66; */
    backdrop-filter: blur(3px);
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid #faab6b;
    color: #ccc;
    height: 100%;
    align-items: center;
    border-radius: 10px;
  }
  .search .ant-select .ant-select-selector input::placeholder {
    color: #ccc !important;
  }
  .search .ant-select .ant-select-selector .ant-select-selection-search {
    display: flex;
    align-items: center;
  }
  .ant-dropdown-link {
    display: flex;
    padding: 0 3px;
    backdrop-filter: blur(3px);
    justify-content: space-around;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    color: #ccc;
    border: 1px solid #faab6b;
    /* background-color: #faab6b; */
    border-radius: 5px;
    width: 110px;
  }
</style>
