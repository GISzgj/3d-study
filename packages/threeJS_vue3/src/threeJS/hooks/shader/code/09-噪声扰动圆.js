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
const params = {
  noiseInf: 3.0
}
// 噪声函数
const noiseFun = [
  ` // 噪声函数
  float noise (in vec2 _st) {
      vec2 i = floor(_st);
      vec2 f = fract(_st);
  
      // Four corners in 2D of a tile
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
  
      vec2 u = f * f * (3.0 - 2.0 * f);
  
      return mix(a, b, u.x) +
              (c - a)* u.y * (1.0 - u.x) +
              (d - b) * u.x * u.y;
  }

  `,
  `//	Classic Perlin 2D Noise //	by Stefan Gustavson
    vec4 permute(vec4 x)
    {
        return mod(((x*34.0)+1.0)*x, 289.0);
    }

    vec2 fade(vec2 t)
    {
        return t*t*t*(t*(t*6.0-15.0)+10.0);
    }

    float noise(vec2 P)
    {
        vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
        vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
        Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
        vec4 ix = Pi.xzxz;
        vec4 iy = Pi.yyww;
        vec4 fx = Pf.xzxz;
        vec4 fy = Pf.yyww;
        vec4 i = permute(permute(ix) + iy);
        vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
        vec4 gy = abs(gx) - 0.5;
        vec4 tx = floor(gx + 0.5);
        gx = gx - tx;
        vec2 g00 = vec2(gx.x,gy.x);
        vec2 g10 = vec2(gx.y,gy.y);
        vec2 g01 = vec2(gx.z,gy.z);
        vec2 g11 = vec2(gx.w,gy.w);
        vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
        g00 *= norm.x;
        g01 *= norm.y;
        g10 *= norm.z;
        g11 *= norm.w;
        float n00 = dot(g00, vec2(fx.x, fy.x));
        float n10 = dot(g10, vec2(fx.y, fy.y));
        float n01 = dot(g01, vec2(fx.z, fy.z));
        float n11 = dot(g11, vec2(fx.w, fy.w));
        vec2 fade_xy = fade(Pf.xy);
        vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
        float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
        return 2.3 * n_xy;
    }
`
]
const shaderMaterial = new THREE.RawShaderMaterial({
  uniforms: {
    uTime: {
      value: 1.0
    },
    noiseInf: {
      value: params.noiseInf
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
    const float PI = 3.14159265359;
    uniform float noiseInf;
    varying vec2 vUv;
    varying float vTime;

    // 随机函数
    float random (vec2 st) {
        return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
    }
    
    // 旋转函数
    vec2 rotate(vec2 uv, float rotation, vec2 mid)
    {
        return vec2(
          cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
          cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
        );
    }
    ${noiseFun[1]}
    void main() {
      float baseLine = 0.4;
      float a = vTime * 0.5;
      mat2 m = mat2(
        cos(a), -sin(a),
        sin(a), cos(a)
       );
      // 更改坐标系位置
      vec2 uv = vUv - vec2(0.5, 0.5);
      float dis = length(uv);
      vec2 dir = normalize(vUv-vec2(0.5, 0.5));
      // float noiseValue = noise(vUv + dir * noiseInf + vec2(vTime) * 1.)*0.15;
      float noiseValue = noise(uv + noiseInf * dir + vTime)*0.1;
      gl_FragColor = mix(vec4(1.,1.,0.,1.), vec4(0.2,0.2,0.2,1.), step(baseLine,dis + noiseValue));
      // gl_FragColor = vec4(vec3(noiseValue), 1.) ;

       vec2 d = normalize(vUv - vec2(0.5,0.5));
      // float f = noise(uv * 3.0 + 10.3 + d*noiseInf);
      float f = noise(uv * 3.0 + noiseInf * d);
      // gl_FragColor = vec4(vec3(f), 1.) ;
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
gui
  .add(params, 'noiseInf')
  .name('噪声强度')
  .min(0.0)
  .max(10.0)
  .step(0.01)
  .onChange(val => {
    shaderMaterial.uniforms.noiseInf.value = val
  })
export default {
  renderer,
  camera
}
