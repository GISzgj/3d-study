<template>
  <div class="nav-container">
    <div class="nav-container-bg">
      <div class="nav-left">
        <span>夷陵区智慧交通管理平台</span>
      </div>
      <div class="nav-center"></div>
      <div class="nav-right">
        <div class="nav-main-weather">
          <div class="text">
            <span>{{ times.yearDay }}</span>
            <span>{{ times.week }}</span>
            <span>{{ times.detailTime }}</span>
          </div>
        </div>
        <div class="nav-main-tool">
          <!-- 设置按钮 -->
          <svg-icon class="icon" name="openLayers" @click="openSettings"></svg-icon>
          <!-- 全屏按钮 -->
          <svg-icon class="icon" name="fullScreen" @click="openFull"></svg-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const settingsIsOpen = ref(false)
  const times = ref({})
  function openFull() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      // 如果当前不在全屏模式下
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        // Firefox
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        // Chrome, Safari, and Opera
        document.documentElement.webkitRequestFullscreen()
      } else if (document.documentElement.msRequestFullscreen) {
        // IE/Edge
        document.documentElement.msRequestFullscreen()
      }
    } else {
      // 如果当前在全屏模式下
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari, and Opera
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen()
      }
    }
  }
  function getCurrentTime() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1并补零
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    // 获取星期几的名称
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    const weekday = weekdays[now.getDay()]
    const formattedTime = `${year}.${month}.${day} ${hours}:${minutes}:${seconds} ${weekday}`
    return formattedTime
  }
  function getTime() {
    const currentTime = getCurrentTime().split(' ')
    times.value.yearDay = currentTime[0]
    times.value.detailTime = currentTime[1]
    times.value.week = currentTime[2]
  }
  setInterval(getTime, 1000)

  function openSettings() {
    settingsIsOpen.value = !settingsIsOpen.value
    const viewer = window.viewer
    const scene = viewer.scene
    const primitives = scene.primitives
    const geojsonPrimitive = primitives.get(0)
    geojsonPrimitive.show = !geojsonPrimitive.show
    // const dataSources = viewer.dataSources.getByName('building.geojson')[0]
    // dataSources.show = !dataSources.show

    // const whiteBuilding = viewer.entities.getById('WhiteBuilding')

    // if (whiteBuilding.name === 'WhiteBuilding') {
    //   whiteBuilding.show = !whiteBuilding.show
    // }
  }
</script>

<style lang="stylus" scoped>
  .nav-container
    position: absolute;
    width: 100%;
    overflow: hidden;
    z-index: 999;
    background-image: url('/img/顶部横线高光.png')
    background-position center 0
    background-repeat no-repeat
    background-size: 101% 140%;
    font-size 16px
    .nav-container-bg
      display: flex;
      justify-content: space-between;
      height: 75px;
      margin: 0px 12px 0 12px;
      padding: 17px 12px 0px;
      .nav-left span
        height: 35px
        overflow: visible;
        display: inline-block
        color: #fff;
        font-family: 'YouShe';
        font-weight: 200;
        line-height: 35px;
        font-size:45px;
        letter-spacing: 10px
      .nav-center
        width: 350px;
        height: 49px;
        margin-top: 3px;
        background-repeat: no-repeat;
      .nav-right
        min-width: 415px;
        display: flex;
        .nav-main-weather{
          display: flex
          min-width: 350px;

          // align-items: center
        }
        .nav-main-weather .icon{
          background-image: url('/img/天气icon.png');
        }
        .text
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5), -1px -1px 2px rgba(198, 230, 255, 1);
          font-family: 'YouShe';
          font-weight: lighter;
          font-size: 18px;
          line-height: 22px;
          margin-right: 46px;
          margin-left: 11px;
          :nth-child(2)
            margin-left: 10px;
            margin-right: 10px;
          :nth-child(3)
            font-size: 24px;

        .nav-main-tool {
          display flex
          padding-top 5px
        }
        .nav-main-tool :first-child
          margin-right: 26px;

    .text, .text span
      display: inline-block;
      color: #ffffff;
    .icon
      display: inline-block;
      width: 18px;
      height: 20px;
      // text-align: center;
      // line-height: 21px;
      background-repeat no-repeat
      background-position center center
      background-size contain
      cursor pointer
      // background-color: aqua;
</style>
