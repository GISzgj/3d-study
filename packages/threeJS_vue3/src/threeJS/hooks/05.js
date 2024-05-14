// 导入three
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
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
// 创建几何体
// const geometry = new THREE.BoxGeometry(1, 1, 1)
const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0, -1.0, 1.0, 0.0])
const indices = new Uint8Array([0, 1, 2, 0, 3, 2])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
geometry.setIndex(new THREE.BufferAttribute(indices, 1))
// 设置两个顶点组, 分别设置两个材质;
geometry.addGroup(0, 3, 0) // 0-3个顶点,第0组
geometry.addGroup(3, 3, 1) // 3-6个顶点,第1组
console.log(geometry)
// 点渲染模式
const material = new THREE.MeshBasicMaterial({
  color: 0xfefaf9,
  // side: THREE.DoubleSide,
  wireframe: true
})
const material2 = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
})
//点模型对象
const cube = new THREE.Mesh(geometry, [material, material2])

scene.add(cube)

// 设置相机位置
camera.position.z = 5
camera.position.y = 2
camera.position.x = 3
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
gui.add(eventObj, 'FullScreen').name('全屏')
console.log('cube', cube.material)
// gui.addColor(cube.material, 'color').name('color')

// render.domElement canvas元素添加上去
renderContainer.appendChild(renderer.domElement)
export default {
  renderer,
  camera
}
