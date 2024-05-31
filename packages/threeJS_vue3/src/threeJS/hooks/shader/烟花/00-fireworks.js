import * as Three from 'three'
import fragmentShader from './f1.glsl'
import vertexShader from './v1.glsl'
import fireworksF from './fireworksF.glsl'
import fireworksV from './fireworksV.glsl'
export default class Fireworks {
  constructor(color, to, from = { x: 0, y: 0, z: 0 }) {
    console.log('color', color)
    this.color = color
    // 1 在from位置上建立一个球点
    this.startGeometry = new Three.BufferGeometry(3)
    this.startGeometry.setAttribute(
      'position',
      new Three.Float32BufferAttribute([from.x, from.y, from.z], 3)
    )
    const astepArray = new Float32Array(3)
    astepArray[0] = to.x - from.x
    astepArray[1] = to.y - from.y
    astepArray[2] = to.z - from.x
    const startPointdirection = astepArray
    this.startGeometry.setAttribute(
      'startPointdirection',
      new Three.Float32BufferAttribute(startPointdirection, 3)
    )
    this.startMaterial = new Three.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthTest: false,
      blending: Three.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 20 },
        uColor: { value: this.color }
      }
    })
    this.startPoint = new Three.Points(this.startGeometry, this.startMaterial)
    this.clock = new Three.Clock()
    // 2. 绘制fireworks
    this.fireworkGeometry = new Three.BufferGeometry()
    this.FireworksCount = 180 + Math.floor(Math.random() * 180)
    const positionFireworksArray = new Float32Array(this.FireworksCount * 3)
    const scaleFireArray = new Float32Array(this.FireworksCount)
    const directionArray = new Float32Array(this.FireworksCount * 3)
    for (let i = 0; i < this.FireworksCount; i++) {
      positionFireworksArray[i * 3 + 0] = to.x
      positionFireworksArray[i * 3 + 1] = to.y
      positionFireworksArray[i * 3 + 2] = to.z
      //   设置烟花所有粒子初始化大小
      scaleFireArray[i] = Math.random()
      // 随机方向 需要归一化
      directionArray[i * 3 + 0] = Math.random() * 2 - 1
      directionArray[i * 3 + 1] = Math.random() * 2 - 1
      directionArray[i * 3 + 2] = Math.random() * 2 - 1
    }
    this.fireworkGeometry.setAttribute(
      'position',
      new Three.BufferAttribute(positionFireworksArray, 3)
    )
    this.fireworkGeometry.setAttribute('scale', new Three.BufferAttribute(scaleFireArray, 1))
    this.fireworkGeometry.setAttribute('direction', new Three.BufferAttribute(directionArray, 3))
    this.fireworkMaterial = new Three.ShaderMaterial({
      vertexShader: fireworksV,
      fragmentShader: fireworksF,
      transparent: true,
      depthTest: false,
      blending: Three.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 0 },
        uColor: { value: this.color }
      },
      visible: false
    })
    this.fireworks = new Three.Points(this.fireworkGeometry, this.fireworkMaterial)
    // 5. 添加音频
    const listen = new Three.AudioListener()
    this.fireworkAudio = new Three.Audio(listen)
    const audioLoader = new Three.AudioLoader()
    audioLoader.load(`/assets/audio/pow${Math.floor(Math.random() * 4) + 1}.ogg`, buffer => {
      this.fireworkAudio.setBuffer(buffer)
      this.fireworkAudio.setLoop(false)
      this.fireworkAudio.setVolume(0.7)
    })
    this.playFireworkAudio = false
    this.startAudio = new Three.Audio(listen)
    audioLoader.load('/assets/audio/send.mp3', buffer => {
      this.startAudio.setBuffer(buffer)
      this.startAudio.setLoop(false)
      this.startAudio.setVolume(0.5)
    })
    this.playStartAudio = false
  }
  addScene(scene, camera) {
    scene.add(this.startPoint)
    scene.add(this.fireworks)
    this.scene = scene
  }
  update() {
    const elaspedTime = this.clock.getElapsedTime()
    if (elaspedTime < 1) {
      this.startMaterial.uniforms.uTime.value = elaspedTime
      if (elaspedTime > 0.1) {
        if (!this.startAudio.isPlaying && !this.playStartAudio) {
          this.startAudio.play()
          this.playStartAudio = true
        }
      }
    } else {
      if (!this.fireworkAudio.isPlaying && !this.playFireworkAudio) {
        this.fireworkAudio.play()
        this.playFireworkAudio = true
      }
      this.startMaterial.uniforms.uSize.value = 0
      this.fireworkMaterial.visible = true
      const time = elaspedTime - 1
      this.fireworkMaterial.uniforms.uTime.value = time
      this.fireworkMaterial.uniforms.uSize.value = 20
      this.startPoint.clear()
      this.startGeometry.dispose()
      this.startMaterial.dispose()
      if (time > 5) {
        this.fireworkMaterial.uniforms.uSize.value = 0
        this.fireworks.clear()
        this.fireworkGeometry.dispose()
        this.fireworkMaterial.dispose()
        // 移除所有物体
        this.scene.remove(this.startPoint)
        this.scene.remove(this.fireworks)
        this.startAudio.clear()
        this.fireworkAudio.clear()
        return 'remove'
      }
    }
  }
}

/*
  1. 绘制startPoint 开始发射到散开的位置的物体
  1.1 添加一个球点物体
  1.2 根据起始位置和终点位置确定发射方向
  1.3 在1s后抵达目标位置时移除相关内存
  
  2. 绘制fireworks 开始位置在startPoint 散开的位置； 在这个点进行随机方向散开
  2.0 在第1s中前隐藏物体; 不能使用gl_PointSize=0 依然会有小小点; 不要使用  this.fireworks.visible = false; 性能不好卡顿
  2.1 添加指定数量的烟火粒子物体
  2.2 确定相关顶点属性；粒子大小 散射方向
  2.3 根据时间和方向进行散射
  2.4 释放相关内存

  3. 确定发射和散射粒子的颜色
  4. 最后时间, 移除物体和index.js中的对象

  5. 完善场景
  5.1 添加场景模型 hdr环境图 水面贴图
  5.2 添加音频
 */
