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
// gui.addColor(cube.material, 'color').name('color')

// render.domElement canvas元素添加上去
renderContainer.appendChild(renderer.domElement)
// 添加环境光
const light = new THREE.AmbientLight(0xffffff, 2)
scene.add(light)

const ifcLoader = new IFCLoader()

ifcLoader.ifcManager.setWasmPath('./web-ifc/')
console.log('ifcLoader', ifcLoader)

ifcLoader.load('testData/YQJYSXYJZX-AR.ifc', model => {
  console.log('model', model)
  scene.add(model)
  model.material.map(material => {
    return new THREE.MeshPhysicalMaterial({
      color: material.color,
      roughness: material.roughness,
      opacity: material.opacity,
      transparent: material.transparent
    })
  })
  // 导出gltf
  const exporter = new GLTFExporter()
  const button = document.createElement('button')
  button.innerText = '导出gltf'
  button.style.position = 'absolute'
  button.style.top = '10px'
  button.style.left = '10px'
  button.onclick = () => {
    exporter.parse(model, gltf => {
      console.log('gltf', gltf)
      const output = JSON.stringify(gltf, null, 2)
      // 导出gltf文件
      const blob = new Blob([output], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'output.gltf'
      a.click()
      URL.revokeObjectURL(url)
      a.remove()
    })
  }
  document.body.appendChild(button)
})

export default {
  renderer,
  camera
}
