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

// 设置相机位置
camera.position.z = 15
camera.position.y = 5
camera.position.x = 5
camera.lookAt(0, 0, 0)
// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.2
// 渲染函数
function animate() {
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
  // 设置plane的环境贴图；可以反射环境贴图
  // plane.material.envMap = envMap
})
export default {
  renderer,
  camera
}
