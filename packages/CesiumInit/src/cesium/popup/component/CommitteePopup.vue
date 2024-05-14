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
            <p>
              <img v-if="key === 'PHOTOS'" :src="value" />
              <span v-else>{{ value }}</span>
            </p>
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
      info: '居委会地址',
      img: '/committeeInfo.svg'
    },
    TYPE: {
      info: '居委会类型',
      img: '/committeeInfo.svg'
    },
    enterPosition: {
      info: '居委会入口位置',
      img: '/committeeInfo.svg'
    },
    PHOTOS: {
      info: '相关照片',
      img: '/committeeInfo.svg'
    }
  }
  const dataList = computed(() => {
    // const { ID, CITY, NAME, position, popupComponentName, ...result } = properties
    const { ID, CITY, NAME, popupComponentName, position, ENTR_LAT, ENTR_LON, ...result } =
      properties
    const enterPosition = [ENTR_LON, ENTR_LAT].join(',')
    result.enterPosition = enterPosition
    if (result.PHOTOS && Object.keys(result.PHOTOS).length > 0 && result.PHOTOS?.length > 0) {
      result.PHOTOS = result.PHOTOS
    } else {
      result.PHOTOS =
        'data:image/jpeg;base64,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'
    }
    console.log(result)

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
    // border: 1px solid #d81e06;
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
