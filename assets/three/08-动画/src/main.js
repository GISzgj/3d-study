// 导入threejs
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// 导入lil.gui
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入draco解码器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true // 开启抗锯齿
})
renderer.shadowMap.enabled = true
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 设置相机位置
camera.position.z = 8
camera.position.y = 2.5
camera.position.x = 3
camera.lookAt(0, 1.2, 0)

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 添加网格辅助器
const gridHelper = new THREE.GridHelper(50, 50)
gridHelper.material.opacity = 0.3
gridHelper.material.transparent = true
scene.add(gridHelper)

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true
let mixer, mixer1
let clock = new THREE.Clock()
// 渲染函数
function animate() {
  let delta = clock.getDelta()
  controls.update()
  if (mixer) {
    mixer.update(delta)
  }
  if (mixer1) {
    mixer1.update(delta)
  }
  requestAnimationFrame(animate)
  // 渲染
  renderer.render(scene, camera)
}
animate()

// 监听窗口变化
window.addEventListener('resize', () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机投影矩阵
  camera.updateProjectionMatrix()
})

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader()
rgbeLoader.load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形贴图
  // envMap.mapping = THREE.EquirectangularReflectionMapping;
  envMap.mapping = THREE.EquirectangularRefractionMapping
  // 设置环境贴图
  // scene.background = envMap;
  scene.background = new THREE.Color(0xcccccc)
  // 设置环境贴图
  scene.environment = envMap
})
// rgbeLoader 加载hdr贴图
// 实例化加载器gltf
const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('./draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)
let walkAction, runAction, posAction, greetAction, idleAction
let currentAction = null
// 加载模型
gltfLoader.load(
  // 模型路径
  './model/hilda_regular_00.glb',
  // 加载完成回调
  gltf => {
    console.log(gltf)
    let girl = gltf.scene
    scene.add(gltf.scene)
    mixer = new THREE.AnimationMixer(gltf.scene)
    walkAction = mixer.clipAction(gltf.animations[37])
    runAction = mixer.clipAction(gltf.animations[27])
    idleAction = mixer.clipAction(gltf.animations[6])
    posAction = mixer.clipAction(gltf.animations[23])
    greetAction = mixer.clipAction(gltf.animations[0])
    currentAction = idleAction
    idleAction.play()
    gui.add(mixer, 'timeScale')
    console.log(mixer)
  }
)

// 创建GUI
const gui = new GUI()

let eventObj = {
  stopAll: () => {
    mixer.stopAllAction()
  },
  play: () => {
    mixer._actions.forEach(action => {
      action.play()
    })
  },
  playRun: () => {
    runAction.enabled = true
    runAction.setEffectiveTimeScale(1)
    runAction.setEffectiveWeight(1)
    X
    runAction.play()
    currentAction.crossFadeTo(runAction, 0.5, true)
    currentAction = runAction
  },
  playWalk: () => {
    walkAction.enabled = true
    walkAction.setEffectiveTimeScale(1)
    walkAction.setEffectiveWeight(1)
    walkAction.play()
    currentAction.crossFadeTo(walkAction, 0.5, true)
    currentAction = walkAction
  },
  playGreet: () => {
    greetAction.enabled = true
    greetAction.setEffectiveTimeScale(1)
    greetAction.setEffectiveWeight(1)
    greetAction.play()
    currentAction.crossFadeTo(greetAction, 0.5, true)
    currentAction = greetAction
  },
  playIdle: () => {
    idleAction.enabled = true
    idleAction.setEffectiveTimeScale(1)
    idleAction.setEffectiveWeight(1)
    idleAction.play()
    currentAction.crossFadeTo(idleAction, 0.5, true)
    currentAction = idleAction
  },
  playPos: () => {
    posAction.enabled = true
    posAction.setEffectiveTimeScale(1)
    posAction.setEffectiveWeight(1)
    posAction.play()
    currentAction.crossFadeTo(posAction, 0.5, true)
    currentAction = posAction
  }
}

gui.add(eventObj, 'stopAll')
gui.add(eventObj, 'play')
gui.add(eventObj, 'playRun')
gui.add(eventObj, 'playWalk')
gui.add(eventObj, 'playGreet')
gui.add(eventObj, 'playIdle')
gui.add(eventObj, 'playPos')
