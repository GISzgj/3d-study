<template>
  <component :is="AsyncComp"></component>
</template>
<script setup>
  import { ref, markRaw, defineAsyncComponent } from 'vue'
  const webGL = import.meta.glob('/src/views/*.vue')
  const regester = index => {
    const lastIndex = Object.keys(webGL).length - 1
    const executeIndex = index || lastIndex
    let currentIndex = 0
    for (let key in webGL) {
      if (currentIndex === executeIndex) {
        const file = webGL[key]
        return markRaw(defineAsyncComponent(file))
      }
      currentIndex++
    }
    return webGL
  }
  const AsyncComp = regester()
</script>
<style>
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>
