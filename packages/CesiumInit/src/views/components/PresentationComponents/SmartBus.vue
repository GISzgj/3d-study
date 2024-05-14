<template>
  <div class="container">
    <div class="bus-info-container">
      <b class="title top">路线图层</b>
      <div class="bottom layers">
        <ul>
          <li v-for="(item, index) in poiList" :key="index" class="task-item">
            <input
              type="checkbox"
              class="checkbox"
              v-model="item.checked"
              :id="`traffic${index}`"
              @change="handleCheck(item, index)"
            />
            <label :class="{ completed: item.checked }" :for="`traffic${index}`">
              {{ item.description }}
            </label>
          </li>
        </ul>
      </div>
    </div>
    <div class="bus-info-container">
      <b class="title top">{{ smartBusData.name }}</b>
      <div class="bottom">
        <div class="box">
          <b>{{ smartBusData.quantity }}</b>
          <b>公交数量</b>
        </div>
        <div class="box">
          <b>{{ smartBusData.actionBusQuantity }}</b>
          <b>出动公交</b>
        </div>
        <div class="box">
          <b>{{ smartBusData.faultBusQuantity }}</b>
          <b>故障公交</b>
        </div>
      </div>
    </div>
    <div class="bus-info-container">
      <b class="title top">公交路线</b>
      <div class="bottom">
        <div class="box">
          <b>{{ smartBusData.quantity }}</b>
          <b>公交数量</b>
        </div>
        <div class="box">
          <b>{{ smartBusData.actionBusQuantity }}</b>
          <b>出动公交</b>
        </div>
        <div class="box">
          <b>{{ smartBusData.faultBusQuantity }}</b>
          <b>故障公交</b>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import RoadLightLine from '@/cesium/utils/RoadLightLine.js'
  import { onMounted, shallowRef } from 'vue'
  const smartBusData = {
    name: '公交数据',
    quantity: 354,
    actionBusQuantity: 310,
    faultBusQuantity: 34
  }
  onMounted(() => {
    const viewer = window.viewer
    const roadLightLine1 = new RoadLightLine(viewer, { url: '/geojson/ylq.geojson' })
    const roadLightLine2 = new RoadLightLine(viewer, {
      url: '/geojson/二级.geojson',
      name: 'LightLineMaterialProperty2',
      img: '/texture/spriteline4.png'
    })
    const roadLightLine3 = new RoadLightLine(viewer, {
      url: '/geojson/三级.geojson',
      name: 'LightLineMaterialProperty3',
      img: '/texture/spriteline6.png'
    })
    poiList.value[0].value = roadLightLine1
    poiList.value[1].value = roadLightLine2
    poiList.value[2].value = roadLightLine3
    poiList.value.forEach(item => {
      if (item.checked) return
      const roadLine = item.value
      roadLine.toggleShow()
    })
  })

  const poiList = shallowRef([
    { description: '一级道路', checked: true, type: 'roadLightLine1', value: {} },
    { description: '二级道路', checked: false, type: 'roadLightLine2', value: {} },
    { description: '三级道路', checked: false, type: 'roadLightLine3', value: {} }
  ])
  const handleCheck = (item, index) => {
    const roadLine = item.value
    roadLine.toggleShow()
  }
</script>
<style lang="scss" scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #ccc;
    padding-top: 5px;
    box-sizing: border-box;
    pointer-events: auto;
    .title {
      color: #faab6b;
      // color: rgba(109, 157, 195, 1);

      font-style: italic;
    }
    .bus-info-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 80%;
      margin-bottom: 10px;
      .top {
      }
      .bottom.layers {
        height: 30px;
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        height: 70px;
        width: 100%;
        ul {
          display: flex;
          .task-item {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
          }
          .checkbox {
            display: none;
          }
          label {
            display: inline-block;
            flex: 1;
            margin-right: 10px;
          }
          label::before {
            content: '\a0';
            display: inline-block;
            vertical-align: 0.2em;
            width: 0.8em;
            height: 0.8em;
            margin-right: 0.2em;
            border-radius: 0.2em;
            background-color: rgba(255, 255, 255, 0.3);
            text-indent: 0.15em;
            line-height: 0.2;
            transition: all 0.3s;
          }
          input[type='checkbox']:checked + label::before {
            content: '\2713';
            color: #fff;
            background-color: #faab6b;
          }
        }
        .box {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          height: 100%;
          :last-child {
            font-size: 12px;
            color: #faab6b;
          }
        }
      }
    }
  }
</style>
