<template>
  <div class="container">
    <div class="monitor-info-container" v-for="item in information">
      <Video v-if="!!item.video"></Video>
      <img :src="item.url" v-else />
      <b>{{ item.name }}</b>
    </div>
  </div>
</template>
<script setup>
  import Video from './component/Video.vue'
  const information = [
    { name: 'B路口001监控', video: {} },
    { name: 'B路口002监控', url: '/img/monitor.png' },
    { name: 'B路口003监控', url: '/img/monitor.png' },
    { name: 'B路口004监控', url: '/img/monitor.png' }
  ]
</script>
<style lang="scss" scoped>
  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    pointer-events: auto;
    padding: 15px 0 5px 0;
    .monitor-info-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5em;
      width: 135px;
      img {
        height: 100px;
        width: 100%;
      }
      b {
        color: #ccc;
      }
    }
  }
</style>
