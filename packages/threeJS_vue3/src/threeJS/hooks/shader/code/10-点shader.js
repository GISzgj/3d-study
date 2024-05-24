// 导入three
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { Texture } from 'three'
import { TextureLoader } from 'three'
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

const planeGeometry = new THREE.BufferGeometry()
// 逆时针
const planeposition = [
  [-10, 0, -10],
  [-10, 0, 10],
  [10, 0, 10],
  [10, 0, -10]
]
planeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(planeposition.flat(1), 3))

const textureLoader = new TextureLoader()
const texture = textureLoader.load('/texture/symbol_01.png')
const texture1 = textureLoader.load('/texture/magic_05.png')
const texture2 = textureLoader.load('/texture/spark_05.png')
const pointMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      gl_PointSize = 80.0;
    }
  
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    void main() {
      // [0,0.5]  
      // 彩色圆
      float strength = distance((gl_PointCoord * 2.0 - 1.0), vec2(0.0,0.0));
      vec4 color1 = vec4(0.0, 0.0, 0.0, 0.0);
      vec4 color2 = vec4(gl_PointCoord, 1.0, 1.0);
      gl_FragColor = mix(color2, color1, step(1.0,strength));

      // 纹理采样
      vec4 colorTex = texture2D(uTexture, gl_PointCoord);
      gl_FragColor = vec4(colorTex.rgb, colorTex.r *colorTex.a);

    }
  `,
  transparent: true,
  uniforms: {
    uTexture: {
      value: texture
    },
    uTexture1: {
      value: texture1
    },
    uTexture2: {
      value: texture2
    }
  }
})
const point = new THREE.Points(planeGeometry, pointMaterial)
scene.add(point)
const galaxyParam = {
  count: 5000,
  radius: 10,
  branchNum: 3,
  rotateRate: 0.3,
  color: '#ff6030',
  outColor: '#1b3984'
}
// GalaxyColor
let galaxyColor = new THREE.Color(galaxyParam.color)
let outGalaxyColor = new THREE.Color(galaxyParam.outColor)
let material
const generateGalaxy = () => {
  const geometry = new THREE.BufferGeometry()
  material = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float imageIndex;
      varying float vImageIndex;
      varying vec3 vColor;
      uniform float uTime;
      mat3 rotateY(float angle){
        float s = sin(angle);
        float c = cos(angle);
        return mat3(
          c, s, 1.0,
          -s, c, 1.0,
          0.,0.,1.0
        );
      }
      void main(){
        vImageIndex = imageIndex;
        vec4 modelPosition = modelMatrix * vec4( position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        viewPosition.xzy = viewPosition.xzy * rotateY(uTime);
        gl_Position = projectionMatrix * viewPosition;
        gl_PointSize = 200.0 / -viewPosition.z;
        vColor = color;
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      varying float vImageIndex;
      varying vec3 vColor;
      void main(){
        vec4 textureColor;
        if(vImageIndex==0.0){
           textureColor = texture2D(uTexture, gl_PointCoord);
        }else if(ceil(vImageIndex)==1.0){
           textureColor = texture2D(uTexture1, gl_PointCoord);
        }else if(ceil(vImageIndex) == 2.0){
           textureColor = texture2D(uTexture2, gl_PointCoord);
        }else{
           textureColor = vec4(1.,1.,0.,1.);
        }
        gl_FragColor = vec4(vColor, textureColor.r) ;
        
      }
    `,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,

    uniforms: {
      uTexture: {
        value: texture
      },
      uTexture1: {
        value: texture1
      },
      uTexture2: {
        value: texture2
      },
      uTime: {
        value: 0.0
      }
    }
  })
  const positions = new Float32Array(galaxyParam.count * 3)
  const colors = new Float32Array(galaxyParam.count * 3)
  const angle = (Math.PI * 2) / galaxyParam.branchNum
  // 哪一条分支
  const imageIndex = new Float32Array(galaxyParam.count)
  for (let i = 0; i < galaxyParam.count; i++) {
    const current = i * 3
    let banchAngle = angle * (i % galaxyParam.branchNum)
    const distance = galaxyParam.radius * Math.random()
    // 根据离圆心的距离, 计算角度
    banchAngle += distance * galaxyParam.rotateRate
    const randomX =
      (Math.pow(Math.random() * 2 - 1, 3) * (galaxyParam.radius - distance)) / galaxyParam.radius
    const randomY =
      (Math.pow(Math.random() * 2 - 1, 3) * (galaxyParam.radius - distance)) / galaxyParam.radius
    const randomZ =
      (Math.pow(Math.random() * 2 - 1, 3) * (galaxyParam.radius - distance)) / galaxyParam.radius
    positions[current] = distance * Math.cos(banchAngle) + randomX
    positions[current + 1] = 0 + randomY
    positions[current + 2] = distance * Math.sin(banchAngle) + randomZ
    const mixColor = galaxyColor.clone()
    mixColor.lerp(outGalaxyColor, distance / galaxyParam.radius)

    //   设置颜色
    colors[current] = mixColor.r
    colors[current + 1] = mixColor.g
    colors[current + 2] = mixColor.b
    // 哪一条分支
    imageIndex[i] = Number.parseFloat(i % 3)
  }
  console.log(imageIndex)

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('imageIndex', new THREE.BufferAttribute(imageIndex, 1))
  const points = new THREE.Points(geometry, material)
  scene.add(points)
  return points
}
generateGalaxy()

// 渲染函数
const clock = new THREE.Clock()
function animate() {
  const time = clock.getElapsedTime()
  material.uniforms.uTime.value = time

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
