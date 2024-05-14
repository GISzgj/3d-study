<template>
  <div class="containerRef">
    <Transition>
      <div class="context-menu">
        <ul class="context-menu-list">
          <li
            v-for="(item, index) in properties"
            :key="index"
            @click.stop="e => handleClick(item, e)"
          >
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
<script setup>
  import { getCurrentInstance, onMounted, onBeforeUpdate, nextTick, h } from 'vue'
  import * as Cesium from 'cesium'
  import { ElMessageBox } from 'element-plus'
  import { useMeasureState } from '@/store/useMeasure.js'
  const measureState = useMeasureState()
  // properties 是右键菜单的配置
  const { properties } = defineProps(['properties'])
  let that
  // 处理右键盒子中的点击事件
  const handleClick = (item, e) => {
    that.closeEvent()
    let measure
    if (item.measure) {
      measure = item.measure
    }
    // 每个点击事件拿到name 使用动态组件调用组件
    if (!item.componentName) return
    if (item.componentName === 'RigthPosition') {
      // 通过that获取地球位置
      const positionCc = Cesium.Cartographic.fromCartesian(that.positionC3)

      const position = [
        Cesium.Math.toDegrees(positionCc.longitude),
        Cesium.Math.toDegrees(positionCc.latitude)
      ]
      // `右键位置信息  [${position}]  `
      ElMessageBox({
        title: '右键位置信息',
        message: h('div', { style: { color: 'black' } }, [
          h('span', '经度: ' + position[0]),
          h('br'),
          h('span', '纬度: ' + position[1])
        ]),
        confirmButtonText: '确定'
      })
    } else if (item.componentName === 'CameraSetting') {
      const camera = window.viewer.camera
      const result = getCameraPosition(camera)
      console.log('result', result)
      ElMessageBox({
        title: '相机设置信息',
        message: h('div', { style: { color: 'black' } }, [
          h('span', '设置信息:'),
          h('br'),
          h(
            'pre',
            {
              style: {
                padding: '20px'
              }
            },
            JSON.stringify(result, null, 2).split(',').join(',\n')
          )
        ]),
        confirmButtonText: '确定'
      })
    } else if (item.componentName === 'Rotation') {
      const viewer = window.viewer
      viewer.isRotation = !viewer.isRotation
    } else if (item.componentName === 'LineMeasurement') {
      measureState.isMeasure = true
      measure.drawLineMeasureGraphics({
        clampToGround: true,
        callback: () => {
          measureState.isMeasure = false
        }
      })
    } else if (item.componentName === 'AreaMeasurement') {
      measureState.isMeasure = true
      measure.drawAreaMeasureGraphics({
        clampToGround: true,
        measure: true,
        callback: () => {
          measureState.isMeasure = false
        }
      })
    } else if (item.componentName === 'ClearMeasurement') {
      measure._drawLayer.entities.removeAll()
    }
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
  onMounted(() => {
    that = getCurrentInstance().vnode
    console.log('that', that)
  })
</script>
<style>
  .el-overlay .el-message-box {
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
<style scoped>
  :deep(.el-overlay) .el-message-box {
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
  }
  .containerRef {
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .context-menu ul,
  .context-menu li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .context-menu {
    min-width: 120px; /*菜单宽度*/
    max-width: 200px;
    padding: 5px 7px; /*菜单内边距*/
    background-color: rgba(76, 109, 163, 0.5);
    backdrop-filter: blur(2px);
    color: #000000;
    border: 1px solid #4d5283; /*菜单边框*/
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); /*菜单阴影*/
    border-radius: 10px;
    z-index: 99999;
  }
  .context-menu .context-menu-list li {
    text-indent: 0.5em;
    font-family: Arial, sans-serif; /*字体*/
    font-size: 14px; /*字号*/
    line-height: 28px;
    /* color: #333; 颜色 */
  }
  .context-menu .context-menu-list li {
    transition: all 0.08s linear; /*动画效果*/
  }
  .context-menu .context-menu-list li:hover {
    background-color: rgba(18, 115, 225, 0.8); /*菜单项鼠标悬停背景色*/
    color: #fff; /*菜单项鼠标悬停颜色*/
    border-radius: 5px;
  }
  .context-menu .context-menu-list li span:hover {
    cursor: default;
  }

  .containerRef .context-menu::after {
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
    border-top: 15px solid rgba(76, 109, 163, 0.5);
    border-bottom: 1px solid #181818;
  }
</style>
