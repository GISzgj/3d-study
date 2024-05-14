// 导入three
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 创建场景(相机+物体)
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // fov相机视角
  window.innerWidth / window.innerHeight,
  0.1, // 近平面
  1000 // 远平面
)
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
// 渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)

// render.domElement canvas元素添加上去
document.body.appendChild(renderer.domElement)

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// 根据几何体和材质 来 创建网格
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
// 设置相机位置
camera.position.z = 5
camera.position.y = 2
camera.position.x = 3
camera.lookAt(0, 0, 0)
// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
console.log(controls)
controls.enableDamping = true
controls.dampingFactor = 0.8
controls.autoRotate = true
// 渲染函数
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  // console.log(cube)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  // 渲染
  renderer.render(scene, camera)
}
animate()
