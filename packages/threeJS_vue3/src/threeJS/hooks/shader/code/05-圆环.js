// 导入three
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
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
camera.position.z = 0
camera.position.y = 25
camera.position.x = 0
camera.lookAt(0, 0, 0)
// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.2

renderContainer.appendChild(renderer.domElement)

// 获取各向异性的最大值
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
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

const geometry = new THREE.PlaneGeometry(10, 10)
console.log('geometry', geometry)

const planeGeometry = new THREE.BufferGeometry()
// 逆时针
const planeposition = [
  [-10, 0, -10],
  [-10, 0, 10],
  [10, 0, 10],
  [10, 0, 10],
  [10, 0, -10],
  [-10, 0, -10]
]
// 如果要使用BufferGeometry，需要重新部署UV注意position和uv的对应关系
// 注意uv坐标系
const uvs = [
  [0, 1],
  [0, 0],
  [1, 0],
  [1, 0],
  [1, 1],
  [0, 1]
]
planeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(planeposition.flat(1), 3))
planeGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs.flat(), 2))
const shaderMaterial = new THREE.RawShaderMaterial({
  uniforms: {
    uTime: {
      value: 0
    }
  },
  vertexShader: `
    precision highp float;
    attribute vec2 uv;
    attribute vec3 position;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vTime;
    void main() {
      vTime = uTime;
      vUv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      gl_Position =  projectionMatrix * viewMatrix * modelPosition;
    }
  `,
  fragmentShader: `
    precision highp float;
    varying vec2 vUv;
    varying float vTime;
    void main() {
      float strength = step(0.5, distance(vec2(vUv.x, vUv.y), vec2(0.5,0.5)) + 0.25);
      strength += (1.0 - step(0.5,  distance(vec2(vUv.x, vUv.y), vec2(0.5,0.5)) + 0.35));
      gl_FragColor = vec4(strength, strength, strength , 1.0);
    }
  `
})

const point = new THREE.Points(
  planeGeometry,
  new THREE.PointsMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
    // transparent: true,
  })
)

scene.add(point)
const plane = new THREE.Mesh(planeGeometry, shaderMaterial)
scene.add(plane)
// scene.add(new THREE.Mesh(geometry, shaderMaterial))

// 渲染函数
const clock = new THREE.Clock()
function animate() {
  const time = clock.getElapsedTime()
  shaderMaterial.uniforms.uTime.value = time
  // console.log(shaderMaterial.uniforms)

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
export default {
  renderer,
  camera
}
