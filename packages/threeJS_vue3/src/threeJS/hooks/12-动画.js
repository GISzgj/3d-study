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
let mixers = []
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
const clock = new THREE.Clock()
function animate() {
  let delta = clock.getDelta()
  requestAnimationFrame(animate)
  if (mixers.length > 0) {
    for (let item of mixers) {
      item.update(delta)
    }
  }
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
// 加载hdr贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  scene.background = envMap
  scene.environment = envMap

  // 设置plane的环境贴图；可以反射环境贴图
  // plane.material.envMap = envMap
})
// 加载环境光
// const light = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(light)
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({
  color: 0x00ffff
})
const mesh = new THREE.Mesh(geometry, material)
mesh.name = 'cube'
scene.add(mesh)
const positionKF = new THREE.VectorKeyframeTrack(
  'cube.position',
  [0, 1, 2, 3, 4],
  [0, 0, 0, 0, 2, 0, 4, 0, 0, 0, 2, 0, 0, 0, 0]
)
const quaternion = new THREE.Quaternion()
const q1 = quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI).toArray()
const q2 = quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI).toArray()
const q3 = quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI).toArray()
const q4 = quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0).toArray()
const rotationKF = new THREE.QuaternionKeyframeTrack(
  'cube.quaternion',
  [0, 2, 3, 4],
  q1.concat(q2, q3, q4)
)
const mixer = new THREE.AnimationMixer(mesh)
const clip = new THREE.AnimationClip('move', 4, [positionKF, rotationKF])
const action = mixer.clipAction(clip)
action.play()
mixers.push(mixer)
let walkAction
const gltfLoader = new GLTFLoader()
gltfLoader.load('/model/fantasy_girl.glb', gltf => {
  // gltfLoader.load('/model/hilda_regular_00.glb', gltf => {
  // gltfLoader.load('/model/stylized_girl.glb', gltf => {
  console.log(gltf)
  const girl = gltf.scene
  scene.add(girl)
  girl.scale.set(0.02, 0.02, 0.02)
  const mixergirl = new THREE.AnimationMixer(girl)
  console.log('mixergirl', mixergirl)
  walkAction = mixergirl.clipAction(gltf.animations[25])
  walkAction.play()
  mixers.push(mixergirl)

  const booleanKF = new THREE.BooleanKeyframeTrack(
    name + '.visible',
    [0, 1, 2, 3, 4],
    [true, false, true, false, true]
  )
  const clip = new THREE.AnimationClip('bool', 4, [booleanKF])
  const action = mixergirl.clipAction(clip)
  // action.play()
  // mixers.push(mixerMoon)
})
export default {
  renderer,
  camera
}
