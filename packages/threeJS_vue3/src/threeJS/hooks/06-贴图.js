// 导入three
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
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
const renderer = new THREE.WebGLRenderer()

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
// gui.addColor(cube.material, 'color').name('color')

// render.domElement canvas元素添加上去
renderContainer.appendChild(renderer.domElement)

// 创建纹理加载器
const textureLoader = new THREE.TextureLoader()
let texture = textureLoader.load('/texture/watercover/CityNewYork002_COL_VAR1_1K.png')

const planeGeometry = new THREE.PlaneGeometry(10, 10)
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture, transparent: true })
// 加载ao贴图——环境遮挡贴图
let aoMap = textureLoader.load('/texture/watercover/CityNewYork002_AO_1K.jpg')
material.aoMap = aoMap
// 加载透明度贴图
const alphaMap = textureLoader.load('/texture/door/alpha.jpg')
material.alphaMap = alphaMap
// 加载光照贴图——一般用于窗户上作为贴膜
const lightMap = textureLoader.load('/texture/colors.png')
material.lightMap = lightMap

// 加载hdr贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  scene.background = envMap
  // 设置plane的环境贴图；可以反射环境贴图
  plane.material.envMap = envMap
})
// 高光贴图————表示不同区域反射光的强度
const plane = new THREE.Mesh(planeGeometry, material)
scene.add(plane)

gui.add(eventObj, 'FullScreen').name('全屏')
gui.add(material, 'aoMapIntensity').name('环境遮挡贴图强度').min(0).max(1)

export default {
  renderer,
  camera
}
