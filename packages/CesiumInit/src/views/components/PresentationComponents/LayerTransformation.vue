<template>
  <div class="container">
    <ul>
      <li v-for="(item, index) in poiList" :key="index" class="task-item">
        <input
          type="checkbox"
          class="checkbox"
          v-model="item.checked"
          :id="`POIcheckbox${index}`"
          @change="handleCheck(item, index)"
        />
        <label :class="{ completed: item.checked }" :for="`POIcheckbox${index}`">
          {{ item.description }}
        </label>
        <button :class="{ normall: true, completed: item.checked }" @click="flyToPoi(item.type)">
          定位
        </button>
      </li>
    </ul>
  </div>
</template>
<script setup>
  import { onMounted, inject, provide, nextTick, watch, onBeforeMount } from 'vue'
  import { AddPoiClass } from '@/cesium/hooks/addPoi.js'
  let addPoiClass
  const poiList = ref([
    { description: '居委会POI', checked: true, type: 'committee' },
    { description: '停车场POI', checked: false, type: 'parking' },
    { description: '公园POI', checked: false, type: 'garden' },
    { description: '医院POI', checked: false, type: 'hospital' },
    { description: '公司POI', checked: false, type: 'company' },
    { description: '公交站点', checked: false, type: 'busStation' }
  ])
  onMounted(() => {
    const viewer = window.viewer
    addPoiClass = new AddPoiClass(viewer)
    // 默认加载的图层
    poiList.value.forEach(item => {
      if (!item.checked) return
      addPoiClass.addPoi(item.type)
    })
  })
  const handleCheck = (item, index) => {
    const state = item.checked
    const type = item.type
    if (state) {
      addPoiClass.addPoi(type)
    } else {
      addPoiClass.removePoiFromType(type)
    }
  }
  const flyToPoi = type => {
    addPoiClass && addPoiClass.flyTo(type)
  }
  onBeforeMount(() => {
    addPoiClass = null
  })
</script>
<style lang="scss" scoped>
  .container {
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    pointer-events: auto;
    color: #ccc;
    ul {
      padding: 5px 0;
      width: 100%;
    }
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
    }
    label::before {
      content: '\a0';
      display: inline-block;
      vertical-align: 0.2em;
      width: 0.8em;
      height: 0.8em;
      margin-right: 1.5em;
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
    .normall {
      color: #ccc;
      opacity: 0.5; //设置蒙版效果
      pointer-events: none; //禁止鼠标事件
      background-color: transparent;
    }
    .completed {
      color: #faab6b;
      opacity: 1;
      pointer-events: auto;
    }
  }
</style>
