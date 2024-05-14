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
scene.add(axesHelper)
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true
})

// 设置相机位置
camera.position.z = 15
camera.position.y = 5
camera.position.x = 5
camera.lookAt(0, 0, 0)
camera.position.set(0, 0, 41)
// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.2
// con
function createPoints(url, size = 0.5) {
  const particlesGeometry = new THREE.BufferGeometry()
  const count = 10000

  // 设置缓冲区数组
  const positions = new Float32Array(count * 3)
  // 设置粒子顶点颜色
  const colors = new Float32Array(count * 3)
  // 设置顶点
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100
    colors[i] = Math.random()
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // 设置点材质
  const pointsMaterial = new THREE.PointsMaterial()
  pointsMaterial.size = size
  pointsMaterial.color.set(0xfff000)
  // 相机深度而衰减
  pointsMaterial.sizeAttenuation = true

  // 载入纹理
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(url)
  // 设置点材质纹理
  pointsMaterial.map = texture
  pointsMaterial.alphaMap = texture
  pointsMaterial.transparent = true
  pointsMaterial.depthWrite = false
  pointsMaterial.blending = THREE.AdditiveBlending
  // 设置启动顶点颜色
  pointsMaterial.vertexColors = true
  const points = new THREE.Points(particlesGeometry, pointsMaterial)
  scene.add(points)
  return points
}

const pointsSnow = createPoints('/texture/magic_05.png', 2.5)
console.log('pointsSnow', pointsSnow)

// 渲染函数
const clock = new THREE.Clock()
function animate() {
  const time = clock.getElapsedTime()
  if (pointsSnow) {
    pointsSnow.rotation.x = time * 0.5
    // pointsSnow.position.y = -time * time * 0.5
  }
  requestAnimationFrame(animate)

  controls.update()
  renderer.render(scene, camera)
}
animate()

renderContainer.appendChild(renderer.domElement)

// 获取各向异性的最大值
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
// 16
console.log('maxAnisotropy', maxAnisotropy)
// 加载hdr贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形贴图
  console.log('envMap', envMap)

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

// 创建球几何体
const sphereGeometry = new THREE.SphereGeometry(3, 32, 32)
// 创建点材质
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  wireframe: true
})
const mesh = new THREE.Mesh(sphereGeometry, material)
// scene.add(mesh)
// 纹理
// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load('/texture/1.png')
const pointMateria = new THREE.PointsMaterial({
  color: 0x00ff00,
  size: 0.1
})

const points = new THREE.Points(sphereGeometry, pointMateria)
scene.add(points)
export default {
  renderer,
  camera
}
