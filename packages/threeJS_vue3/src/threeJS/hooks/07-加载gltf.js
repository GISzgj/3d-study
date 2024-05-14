// 导入three
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入draco解码器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
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
texture.colorSpace = THREE.SRGBColorSpace

const planeGeometry = new THREE.PlaneGeometry(10, 10)
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture, transparent: true })
// 加载ao贴图——环境遮挡贴图
let aoMap = textureLoader.load('/texture/watercover/CityNewYork002_AO_1K.jpg')
material.aoMap = aoMap
// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader()
rgbeLoader.load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  scene.background = envMap
  // 设置环境贴图
  scene.environment = envMap
  // 设置plane的环境贴图
  material.envMap = envMap
})

const plane = new THREE.Mesh(planeGeometry, material)
scene.add(plane)

// 实例化加载器gltf
const gltfLoader = new GLTFLoader()
gltfLoader.load(
  // 模型路径
  './model/Duck.glb',
  // 加载完成回调
  gltf => {
    console.log('gltf', gltf)
    scene.add(gltf.scene)
  }
)
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('./draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
  // 模型路径
  './model/city.glb',
  // 加载完成回调
  gltf => {
    scene.add(gltf.scene)
    const duckMesh = scene.getObjectByName('LOD3spShape')
    const duckGeometry = duckMesh.geometry
    // 设置几何体 几何中心居中
    // duckGeometry.center()
    // 计算包围盒
    duckGeometry.computeBoundingBox()
    console.log(duckGeometry)
    const duckBox = duckGeometry.boundingBox
    duckBox.applyMatrix4(duckMesh.matrixWorld)
    // 获取包围盒的中心
    const center = duckBox.getCenter(new THREE.Vector3())
    console.log('center', center)
    let boxHelper = new THREE.Box3Helper(duckBox, 0xff0000)
    scene.add(boxHelper)
    // 获取包围球
    const duckSphere = duckGeometry.boundingSphere
    duckSphere.applyMatrix4(duckMesh.matrixWorld)
    console.log('duckSphere', duckSphere)
    const sphereGeometry = new THREE.SphereGeometry(duckSphere.radius, 16, 16)
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    console.log('sphereGeometry', sphereGeometry)
    console.log('sphereMesh', sphereMesh)
    sphereMesh.position.copy(duckSphere.center)
    scene.add(sphereMesh)
  }
)
// 创建射线
const raycaster = new THREE.Raycaster()
// 创建鼠标向量
const mouse = new THREE.Vector2()
renderer.domElement.addEventListener('click', e => {
  console.log(e.clientX, e.clientY)
  const canvasDom = renderer.domElement
  console.log(canvasDom.width, canvasDom.height)
  console.log('window', window.innerWidth, window.innerHeight)
  // 归一化
  mouse.x = (e.clientX / canvasDom.width) * 2 - 1
  mouse.y = -(e.clientY / canvasDom.height) * 2 + 1
  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects([scene.children[0]])
  console.log(intersects)
})
gui.add(eventObj, 'FullScreen').name('全屏')
gui.add(material, 'aoMapIntensity').name('环境遮挡贴图强度').min(0).max(1)

export default {
  renderer,
  camera
}
