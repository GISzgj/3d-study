<template>
  <div class="component-contanter">
    <div class="component-nav">
      <span class="icon" :style="`background-image: url(${iconUrl})`"></span>
      <span class="text">{{ titleInfo?.text }}</span>
      <span class="text eng">{{ titleInfo?.eng }}</span>
    </div>
    <div>
      <component :is="loadComponent(props.componentName)"></component>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick, watch, inject, computed, onBeforeUpdate } from 'vue'
  import { loadComponent } from './Hooks/customComponent.js'
  defineOptions({
    name: 'presentation-component'
  })
  const props = defineProps({
    titleInfo: Object,
    componentName: String
  })
  const titleInfo = computed(() => {
    return props.titleInfo
  })
  const iconUrl = '/img/组件箭头.png'
  onBeforeUpdate(() => {
    console.log('onBeforeUpdate')
  })
</script>

<style scoped>
  .component-contanter {
    background: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2));
    backdrop-filter: blur(2px);
  }
  .component-contanter .component-nav {
    display: flex;
    align-items: center;
    height: 60px;
    width: 100%;
    background-image: url('/img/组件下边线.png');
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: 100%;
    /* background-color: #f00; */
  }
  .component-contanter .component-nav .icon {
    height: 33px;
    width: 33px;
    line-height: 33px;
    /* background-color: #fff; */
  }
  .text {
    display: inline-block;
    color: #ffffff;
    font-size: 18px;
  }
  .eng {
    margin: 7px 0 0 10px;
    color: #ccc;
    font-size: 14px;
    font-family: 'PingFang';
    font-style: italic;
  }
  .icon {
    display: inline-block;
    height: 100%;
    text-align: center;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
  }
</style>
