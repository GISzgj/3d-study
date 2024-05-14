<template>
  <div>
    <div id="cesiumContainer"></div>
    <!-- <button @click="handleClick" style="position: absolute; top: 0; z-index: 999; width: 50px">
      打点
    </button> -->
  </div>
</template>

<script setup>
  import * as Cesium from 'cesium'
  import { Button } from '@zgj/vue3-components'
  import { $tool } from '@zgj/utils'
  import { initCesium } from '@/cesium/initCesium.js'

  onMounted(() => {
    window.viewer = initCesium('cesiumContainer')
  })

  // ____________ _____________________________ _____________________________测试 _______________________________ _______________________________ _______________________________
  function handleClick() {
    const viewer = window.viewer
    console.log(viewer)
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(event => {
      // let position = viewer.scene.pickPosition(event.position)
      const mousePosition = new Cesium.Cartesian2(event.position.x, event.position.y)
      const ellipsoid = viewer.scene.globe.ellipsoid
      const cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid)
      // console.log(cartesian)
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      var lat = Cesium.Math.toDegrees(cartographic.latitude)
      var lng = Cesium.Math.toDegrees(cartographic.longitude)
      var alt = cartographic.height
      console.log(lat, lng, alt)
      console.log(getCameraPosition(viewer.camera))
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
  // 获取相机设置
  function getCameraPosition(camera, name) {
    const { positionWC, heading, pitch, roll } = camera
    name = name || '默认名字'
    return {
      name: name,
      x: positionWC.x,
      y: positionWC.y,
      z: positionWC.z,
      heading: heading,
      pitch: pitch,
      roll: roll
    }
  }
  // ____________ _____________________________ _____________________________测试 _______________________________ _______________________________ ___________________________
</script>

<style lang="scss">
  #cesiumContainer {
    position: relative;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
  .cesium-viewer-bottom {
    display: none !important;
  }

  .scroll-box {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    // justify-content: space-between;
    pointer-events: none;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    // background-color: bisque;
  }
  .left {
    padding: 0;
    box-sizing: border-box;
    width: 300px;
    height: 90%;
    position: fixed;
    top: 90px;
    left: 20px;
    .travel-status {
      box-sizing: border-box;
    }
  }
  .right {
    padding: 0;
    box-sizing: border-box;
    height: 90%;
    width: 350px;
    position: fixed;
    top: 90px;
    right: 20px;
  }
</style>
