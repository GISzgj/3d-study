<template>
  <div id="render-container" v-Gresize="handleResize"></div>
</template>
<script setup>
  import threeFile from './threeJS/index.js'
  const threeObj = shallowRef({})
  threeFile.executeThreeJS().then(res => {
    threeObj.value = res.default
    const renderContainer = document.getElementById('render-container')
    // 渲染的尺寸大小
    threeObj.value.renderer.setSize(renderContainer.clientWidth, renderContainer.clientHeight)
  })
  const handleResize = res => {
    if (threeObj.value.renderer) {
      const { renderer, camera } = threeObj.value
      const { width, height } = res
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
  }
</script>
<style lang="scss" scoped>
  #render-container {
    width: 100vw;
    height: 100vh;
  }
</style>
