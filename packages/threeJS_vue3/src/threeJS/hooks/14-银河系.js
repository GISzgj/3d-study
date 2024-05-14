// 导入three
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入draco解码器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// ifc
import { IFCLoader } from 'web-ifc-three'
// gltf
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'
// import { IfcLoader } from 'web-ifc-three/IFCLoader'
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
// scene.add(axesHelper)
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true
})

// 设置相机位置
camera.position.z = 10
camera.position.y = 4
camera.position.x = 2
camera.lookAt(0, 0, 0)
// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.2
controls.autoRotate = true

renderContainer.appendChild(renderer.domElement)

// 获取各向异性的最大值
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
// 加载hdr贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形贴图
  console.log('envMap', envMap)

  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  // scene.background = envMap
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

const params = {
  size: 0.25,
  count: 5000,
  color: '#ff6030',
  radius: 5,
  branchNum: 3,
  rotateScale: 0.3,
  endColor: '#1b3984'
}
let geometry
let material

const generateGalaxy = () => {
  const startColor = new THREE.Color(params.color)
  const endColor = new THREE.Color(params.endColor)
  // 生成顶点
  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)
  for (let i = 0; i < params.count; i++) {
    const current = i * 3
    // i是第n个点 设置三个分支； 360dug
    const branchAngle = (i % params.branchNum) * ((2 * Math.PI) / params.branchNum)
    const radius = Math.random() * params.radius * 2
    // 0-r
    const randomX = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - radius)) / params.radius
    const randomY = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - radius)) / params.radius
    const randomZ = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - radius)) / params.radius
    positions[current] = radius * Math.cos(branchAngle + 0 + radius * params.rotateScale) + randomX
    positions[current + 1] = 0 + randomY
    positions[current + 2] =
      radius * Math.sin(branchAngle + 0 + radius * params.rotateScale) + randomZ
    // colors
    let mixColor = startColor.clone()
    mixColor.lerp(endColor, (radius + 1) / params.radius)
    colors[current] = mixColor.r
    colors[current + 1] = mixColor.g
    colors[current + 2] = mixColor.b
    mixColor = null
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    // color: params.color,
    map: texture,
    transparent: true,
    alphaMap: texture,
    depthWrite: false,
    vertexColors: true
  })
  const points = new THREE.Points(geometry, material)
  scene.add(points)
  return points
}
generateGalaxy()
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
