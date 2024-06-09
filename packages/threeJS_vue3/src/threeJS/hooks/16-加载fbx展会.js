// 导入three
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入draco解码器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// fbx
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

import threeTools from '../../utils/tools'
const renderContainer = document.getElementById('render-container')
// 创建场景(相机+物体)
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // fov相机视角
  window.innerWidth / window.innerHeight,
  0.1, // 近平面
  30 // 远平面
)

// 三维坐标系,右手坐标系: 蓝线为z轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true
})

// 设置相机位置
camera.position.z = 15
camera.position.y = 12
camera.position.x = 6
camera.lookAt(0, 0, 0)
// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.2
// controls.autoRotate = true

renderContainer.appendChild(renderer.domElement)

// 获取各向异性的最大值
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
// 加载hdr贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/zhanHui/studio023.hdr', envMap => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  scene.background = envMap
  scene.environment = envMap
  // 设置plane的环境贴图；可以反射环境贴图
  // plane.material.envMap = envMap
})
let eventObj = {
  FullScreen: () => {
    renderer.domElement.requestFullscreen()
  }
}
const gui = new GUI()
gui.add(eventObj, 'FullScreen')

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/texture/magic_05.png')
const material = new THREE.MeshBasicMaterial({
  wireframe: true
})
const geometry = new THREE.BoxGeometry(1, 1, 1)
const redMaterial = new THREE.MeshBasicMaterial({
  color: '#ff0000'
})

// 加载fbx模型
const fbxLoader = new FBXLoader()
// fbxLoader.load('/zhanHui/All.FBX', fbx => {
//   console.log(fbx)
// })
// 实例化加载器gltf
const gltfLoader = new GLTFLoader()
gltfLoader.load('./zhanHui/zhuanhuiJianKe.glb', gltf => {
  console.log('gltf', gltf)
  const zhanHuiScene = gltf.scene

  scene.add(gltf.scene)
  const diBan = zhanHuiScene.getObjectByName('Diban')
  diBan.material.roughness = 0.4
  console.log('scene.getObjectByName', zhanHuiScene.getObjectByName('Diban'))
})

// 渲染函数
const clock = new THREE.Clock()
function animate() {
  const time = clock.getElapsedTime()
  requestAnimationFrame(animate)

  controls.update()
  renderer.render(scene, camera)
}
animate()
export default {
  renderer,
  camera
}
