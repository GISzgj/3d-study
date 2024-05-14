// 导入threejs
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 导入hdr加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 导入dds格式加载器
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";
// ktx2格式加载器
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
// 导入tga
import { TGALoader } from "three/addons/loaders/TGALoader.js";

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机位置
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置带阻尼的惯性
controls.enableDamping = true;
// 设置阻尼系数
controls.dampingFactor = 0.05;
// 设置旋转速度
// controls.autoRotate = true;

// 渲染函数
function animate() {
  controls.update();
  requestAnimationFrame(animate);
  // 渲染
  renderer.render(scene, camera);
}
animate();

// 监听窗口变化
window.addEventListener("resize", () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机投影矩阵
  camera.updateProjectionMatrix();
});

let params = {};

// 创建GUI
const gui = new GUI();

// 创建纹理加载器
let textureLoader = new THREE.TextureLoader();
// 加载纹理
// let texture = textureLoader.load("./texture/filter/minecraft.png");
let texture = textureLoader.load("./texture/brick/brick_diffuse.jpg");
// let texture = textureLoader.load("./texture/rain.png");
let planeGeometry = new THREE.PlaneGeometry(1, 1);
let planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  map: texture,
  // 允许透明
  transparent: true,
});
// planeMaterial.map = texture;
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// texture.flipY = false;
// texture.flipY = true;

texture.colorSpace = THREE.SRGBColorSpace;
// 场景背景
// scene.background = new THREE.Color(0xffffff);
// 直接取映射到的最近的像素
// texture.magFilter = THREE.NearestFilter;
// 取映射到的最近的四个像素的平均值
// texture.magFilter = THREE.LinearFilter;

// texture.minFilter = THREE.NearestFilter;
// texture.minFilter = THREE.LinearFilter;
texture.minFilter = THREE.LinearMipMapLinearFilter;
// texture.minFilter = THREE.LinearMipMapNearestFilter;
// texture.minFilter = THREE.NearestMipMapLinearFilter;
// texture.minFilter = THREE.NearestMipMapNearestFilter;

// texture.generateMipmaps = false;

// 获取各项异性的最大值
let maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
texture.anisotropy = 4;
console.log(maxAnisotropy);

// rgbeLoader 加载hdr贴图
// let rgbeLoader = new RGBELoader();
// rgbeLoader.load(
//   "./texture/opt/memorial/Alex_Hart-Nature_Lab_Bones_2k.hdr",
//   (envMap) => {
//     // 设置球形贴图
//     envMap.mapping = THREE.EquirectangularReflectionMapping;
//     // 设置环境贴图
//     scene.background = envMap;
//     // 设置环境贴图
//     scene.environment = envMap;
//     plane.material.map = envMap;
//   }
// );

// ktx2加载器;
let ktx2Loader = new KTX2Loader()
  .setTranscoderPath("basis/")
  .detectSupport(renderer);
let ktx2Texture = ktx2Loader.load(
  "./texture/opt/memorial/Alex_Hart-Nature_Lab_Bones_2k_uastc_flipY_nomipmap.ktx2",
  (texture) => {
    console.log("ktx2", texture);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
    plane.material.map = texture;
  }
);
// 设置色调映射
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// 设置色调映射曝光度
renderer.toneMappingExposure = 1;
gui.add(renderer, "toneMapping", {
  // 无色调映射
  No: THREE.NoToneMapping,
  // 线性色调映射
  Linear: THREE.LinearToneMapping,
  // Reinhard色调映射。这是一种更复杂的色调映射方式，可以更好地处理高亮度的区域。它根据整个图像的平均亮度来调整每个像素的亮度。
  Reinhard: THREE.ReinhardToneMapping,
  // Cineon色调映射。这种方法起源于电影行业，尝试模仿电影胶片的颜色响应，使得图像在颜色上看起来更富有电影感。
  Cineon: THREE.CineonToneMapping,
  // ACES Filmic色调映射。这是一种模仿电影行业中常用的色调映射算法，可以产生类似于电影的视觉效果。
  ACESFilmic: THREE.ACESFilmicToneMapping,
});
gui.add(renderer, "toneMappingExposure", 0, 3, 0.1);
