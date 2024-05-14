import * as Cesium from 'cesium'
import { createVNode, render } from 'vue'
import { loadComponent } from './customPopupComponent.js'
// import Popup from './ParkingPopup.vue'
/**
 * @example 点击时调用下面的函数传入属性信息,点击空白处
 * bubble && bubble.windowClose()
 function useBubble(viewer,properties, position, typeName) {
  bubble && bubble.windowClose()
  bubble = new Bubble({
    position,
    viewer: viewer,
    properties
  },typeName)
}
 */
export default class Bubble {
  // 根据传入的 componentName 来决定加载那个组件
  constructor(val, componentName) {
    this.viewer = val.viewer
    this.position = val.position
    this.closeCallback = val.closeCallback || null
    const PopupRes = loadComponent(componentName)
    PopupRes.then(res => {
      const Popup = res.default
      this.vmInstance = createVNode(Popup, {
        properties: val.properties
      })
      let mountNode = document.createElement('div')
      this.vmInstance.closeEvent = () => {
        this.windowClose()
      }
      this.vmInstance.positionC3 = this.position
      render(this.vmInstance, mountNode)
      val.viewer.cesiumWidget.container.appendChild(this.vmInstance.el) //将模板生成的内容添加到DOM上
      this.addPostRender()
    })
  }

  //添加场景事件
  addPostRender() {
    this.viewer.scene.postRender.addEventListener(this.postRender, this)
  }

  //场景渲染事件 实时更新窗口的位置 使其与笛卡尔坐标一致
  postRender() {
    if (!this.vmInstance.el || !this.vmInstance.el.style) return
    const canvasHeight = this.viewer.scene.canvas.height
    const windowPosition = new Cesium.Cartesian2()
    //把笛卡尔坐标转屏幕坐标
    Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      this.viewer.scene,
      this.position,
      windowPosition
    )
    const elWidth = this.vmInstance.el.offsetWidth
    // const elHeight = this.vmInstance.el.offsetHeight
    this.vmInstance.el.style.bottom = canvasHeight - windowPosition.y + 25 + 'px'
    this.vmInstance.el.style.left = windowPosition.x - elWidth / 2 + 'px'
  }
  //关闭
  windowClose() {
    if (this.vmInstance) {
      this.vmInstance.el.remove()
      this.vmInstance = null
    }
    this.viewer.scene.postRender.removeEventListener(this.postRender, this) //移除事件监听
    if (this.closeCallback) {
      this.closeCallback()
      this.closeCallback = null
      return
    }
  }
}
