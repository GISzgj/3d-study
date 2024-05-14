<template>
  <div class="main-video">
    <div id="playWind"></div>
  </div>
</template>

<script setup>
  import { onMounted, nextTick, ref, watch } from 'vue'
  import { $tool } from '@zgj/utils'
  const token = 'at.2zh5s51w6018xvsablelcc6t37ow8wn9-3uuh98pza3-10kpk4p-tr3ao5wao'
  const equipmentNum = 'D31582497'
  onMounted(() => {
    let mainVideo = document.querySelector('.main-video')
    let width = mainVideo.clientWidth
    let height = mainVideo.clientHeight
    const ezopenInit = () => {
      let EZOPENDemo = new EZUIKit.EZUIKitPlayer({
        id: 'playWind',
        width,
        height,
        template: '893749193ea84288852bd699cbea3edc',
        url: `ezopen://SLVICG@open.ys7.com/${equipmentNum}/1.live`,
        accessToken: token
      })
    }
    ezopenInit()
  })
  // 这个界面不在我们视线中的时候，关闭定时器
  onBeforeUnmount(() => {})
</script>

<style scoped>
  .main-video {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.38);
  }
</style>
<style></style>
