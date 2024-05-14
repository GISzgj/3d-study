<template>
  <div class="box">
    <div class="area">
      <div class="area-title fontColor">
        <span>{{ properties.NAME }}</span>
      </div>
    </div>
    <div class="box-wrap">
      <div class="content textColor">
        <div class="close" @click="closeClick">X</div>
        <div class="data-li" v-for="(value, key) in dataList">
          <div style="width: 45px; align-self: center; margin-right: 10px">
            <img style="width: 35px; height: 35px" :src="map[key].img" />
          </div>
          <div class="info">
            <p>{{ map[key].info }}</p>
            <p>{{ value }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { getCurrentInstance, onMounted, onBeforeUpdate } from 'vue'
  const { properties } = defineProps(['properties'])
  const map = {
    ADDRESS: {
      info: '医院地址',
      img: '/parkingPinfo.svg'
    },
    PHONE: {
      info: '医院联系方式',
      img: '/parkingPinfo.svg'
    },
    WORKING_HOURS: {
      info: '工作时间',
      img: '/parkingPinfo.svg'
    },
    LEVER: {
      info: '医院级别',
      img: '/parkingPinfo.svg'
    }
  }
  const dataList = computed(() => {
    const { ID, CITY, NAME, position, popupComponentName, ...result } = properties
    return result
  })
  let that
  const closeClick = () => {
    that.closeEvent()
  }
  onMounted(() => {
    that = getCurrentInstance().vnode
  })
</script>
<style lang="scss" scoped>
  .box {
    width: 300px;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .close {
    position: absolute;
    height: 15px;
    width: 15px;
    font-size: 10px;
    top: 5px;
    right: 8px;
    text-align: center;
    line-height: 15px;
    text-shadow: 2px 2px 2px #022122;
    cursor: pointer;
    color: #ccc;
    border: 1px solid #ccc;
    animation: fontColor 1s;
  }
  .box-wrap {
    width: 100%;
    min-height: 220px;
    border-radius: 15px;
    background: 2px;
    backdrop-filter: blur(4px);
    background-color: rgba(63, 72, 84, 0.5);
    box-shadow: 0 0 10px 2px #181818;
  }
  .box-wrap .area {
    position: absolute;
    top: 20px;
    right: 0;
    width: 95%;
    height: 30px;
    border-bottom: 1px solid #ccc;
    animation: area 0.5s;
  }

  .box-wrap::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -18px;
    box-sizing: border-box;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 15px solid rgba(63, 72, 84, 0.9);
    border-bottom: 1px solid #181818;
  }

  .textColor {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 1px 1px 5px #002520d2;
    animation: fontColor 0.5s;
  }

  .area .area-title.fontColor {
    font-size: 16px;
    font-weight: 800;
    color: #ffffff;
    text-shadow: 1px 1px 5px #002520d2;
    animation: fontColor 0.5s;
  }
  .area .area-title.fontColor span {
    display: inline-block;
    padding: 0 5px;
    min-width: 80px;
    height: 30px;
    border: 1px solid #39c1ca;
    background: linear-gradient(to right, #1a494d66, #1a494d);
    line-height: 30px;
    text-align: center;
    margin-bottom: 10px;
    cursor: default;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-content: space-between;
    position: relative;
    padding: 20px 10px;
    // height: 80px;
  }
  .content .data-li {
    display: flex;
    overflow: hidden;
    // white-space: nowrap;
    // text-overflow: ellipsis;
  }
  .content .data-li .info {
    color: #38bac2;
    flex: 1;
  }
  .content .data-li .info p:first-child {
    overflow: hidden;
    color: #ccc;
    word-wrap: break-word;
    font-size: 18px;
  }
  @keyframes fontColor {
    0% {
      color: #ffffff00;
      text-shadow: 1px 1px 5px #00252000;
    }
    40% {
      color: #ffffff00;
      text-shadow: 1px 1px 5px #00252000;
    }
    100% {
      color: #ffffff;
      text-shadow: 1px 1px 5px #002520d2;
    }
  }
  @keyframes area {
    0% {
      width: 0%;
    }
    25% {
      width: 0%;
    }

    100% {
      width: 95%;
    }
  }
</style>
