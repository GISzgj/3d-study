// 导入three
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import Fireworks from './00-fireworks.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入水面
import { Water } from 'three/examples/jsm/objects/Water2.js'
const renderContainer = document.getElementById('render-container')
// 创建场景(相机+物体)
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // fov相机视角
  window.innerWidth / window.innerHeight,
  0.1, // 近平面
  1000 // 远平面
)
// 三维坐标系,右手坐标系: 蓝线为z轴
const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true
})
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.1

// 设置相机位置
camera.position.z = 20
camera.position.y = 8
camera.position.x = 10
camera.lookAt(0, 0, 0)
// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
const conpar = {
  maxPolarAngle: (Math.PI / 3) * 2,
  minPolarAngle: (Math.PI / 3) * 2
}
controls.enableDamping = true
controls.dampingFactor = 0.2
// controls.maxPolarAngle = conpar.maxPolarAngle
// controls.minPolarAngle = conpar.minPolarAngle

renderContainer.appendChild(renderer.domElement)

// 加载hdr贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  scene.background = envMap
  scene.environment = envMap
  // 设置场景的背景
  // 设置plane的环境贴图；可以反射环境贴图
  // plane.material.envMap = envMap
})
const waterGeometry = new THREE.PlaneGeometry(100, 100, 100, 100)
waterGeometry.rotateX(-Math.PI / 2)
const water = new Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  // waterNormals: '/assets/water/Water_2_M_Normal.jpg',
  alpha: 1.0,
  sunColor: 0xffffff
})
water.position.y = -0.5
scene.add(water)
// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
const gltfLoader = new GLTFLoader()
gltfLoader.load('/assets/model/newyears_min.glb', gltf => {
  const group = gltf.scene.children[0].children[0]
  const mesh1 = group.getObjectByName('网格065_19')
  const mesh2 = group.getObjectByName('网格065_16')
  mesh1.material.normalMap = null
  const bright = 5.0
  const basicColor1 = mesh1.material.color
  basicColor1.set(
    new THREE.Color(basicColor1.r * bright, basicColor1.g * bright, basicColor1.b * bright)
  )
  const basicColor2 = mesh2.material.color
  basicColor2.set(
    new THREE.Color(basicColor2.r * bright, basicColor2.g * bright, basicColor2.b * bright)
  )
  group.remove(group.getObjectByName('网格065_21'))
  scene.add(gltf.scene)
})

let frameworks = []
// 渲染函数
const clock = new THREE.Clock()
function animate() {
  const time = clock.getElapsedTime()
  // shaderMaterial.uniforms.uTime.value = time
  if (frameworks) {
    frameworks.forEach((item, i) => {
      const result = item.update()
      if (result === 'remove') {
        frameworks.splice(i, 1)
      }
    })
  }
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()
let eventObj = {
  FullScreen: () => {
    renderer.domElement.requestFullscreen()
  }
}
const gui = new GUI()
gui.add(eventObj, 'FullScreen')

// 创建一个发射器
const planStartGoemetry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32)
const planStartMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  opacity: 1
})
const planStart = new THREE.Mesh(planStartGoemetry, planStartMaterial)
planStart.position.set(0, 2, 2)
planStart.rotation.x = -Math.PI / 8
scene.add(planStart)

const createFireworks = e => {
  const color = new THREE.Color().setHSL(Math.random(), 1, 0.8)
  let position = {
    x: (Math.random() - 0.5) * 40,
    z: -Math.random() * 20,
    y: 10 + Math.random() * 15
  }
  const framework = new Fireworks(color, position, planStart.position)
  framework.addScene(scene, camera)
  frameworks.push(framework)
}
renderer.domElement.addEventListener('dblclick', createFireworks)
window.addEventListener('keydown', createFireworks)

export default {
  renderer,
  camera
}
