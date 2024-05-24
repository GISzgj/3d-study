// 导入three
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import vertexShader from './v.glsl'
import fragmentShader from './f.glsl'
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
scene.add(axesHelper)
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true
})
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.1

// 设置相机位置
camera.position.z = 0
camera.position.y = 5
camera.position.x = 0
camera.lookAt(0, 0, 0)
// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true
controls.dampingFactor = 0.2
renderContainer.appendChild(renderer.domElement)

// 加载hdr贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  // scene.background = envMap
  scene.environment = envMap
  // 设置场景的背景
  // 设置plane的环境贴图；可以反射环境贴图
  // plane.material.envMap = envMap
})
let shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uTime: { value: 0 }
  }
  // side: THREE.DoubleSide
})
const planeGeo = new THREE.PlaneGeometry(1, 1, 512, 512)
const plane = new THREE.Mesh(planeGeo, shaderMaterial)
plane.rotation.x = -Math.PI / 2
// plane.rotateX(Math.PI / 2)
scene.add(plane)

// 渲染函数
const clock = new THREE.Clock()
function animate() {
  const time = clock.getElapsedTime()
  shaderMaterial.uniforms.uTime.value = time
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
export default {
  renderer,
  camera
}
