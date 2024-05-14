// 导入threejs
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 导入hdr加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 导入gltf加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// 导入draco解码器
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
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
  antialias: true, // 开启抗锯齿
});
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机位置
camera.position.z = 8;
camera.position.y = 2.5;
camera.position.x = 3;
camera.lookAt(0, 1.2, 0);

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 添加网格辅助器
const gridHelper = new THREE.GridHelper(50, 50);
gridHelper.material.opacity = 0.3;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置带阻尼的惯性
controls.enableDamping = true;
let mixer, mixer1;
let clock = new THREE.Clock();
// 渲染函数
function animate() {
  let delta = clock.getDelta();
  controls.update();
  if (mixer) {
    mixer.update(delta);
  }
  if (mixer1) {
    mixer1.update(delta);
  }
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

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader();
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  // 设置球形贴图
  // envMap.mapping = THREE.EquirectangularReflectionMapping;
  envMap.mapping = THREE.EquirectangularRefractionMapping;
  // 设置环境贴图
  // scene.background = envMap;
  scene.background = new THREE.Color(0xcccccc);
  // 设置环境贴图
  scene.environment = envMap;
});
// rgbeLoader 加载hdr贴图
// 实例化加载器gltf
const gltfLoader = new GLTFLoader();
// 实例化加载器draco
const dracoLoader = new DRACOLoader();
// 设置draco路径
dracoLoader.setDecoderPath("./draco/");
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader);
// 加载模型
gltfLoader.load(
  // 模型路径
  "./model/moon.glb",
  // 加载完成回调
  (gltf) => {
    console.log(gltf);
    // gltf.scene.scale.set(0.01, 0.01, 0.01);
    scene.add(gltf.scene);
    mixer1 = new THREE.AnimationMixer(gltf.scene);

    //布尔关键帧
    const boolKF = new THREE.BooleanKeyframeTrack(
      "Sketchfab_Scene.visible",
      [0, 1, 2, 3, 4],
      [true, false, true, false, true]
    );
    // 创建动画剪辑
    const clip = new THREE.AnimationClip("bool", 4, [boolKF]);
    // 给模型添加动画
    const action1 = mixer1.clipAction(clip);
    action1.play();
  }
);

let eventObj = {};
// 创建GUI
const gui = new GUI();

// 创建立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: 0xff33ff,
});
const cube = new THREE.Mesh(geometry, material);
cube.name = "cube";
scene.add(cube);

// 创建位移动画
const positionKF = new THREE.VectorKeyframeTrack(
  "cube.position",
  [0, 1, 2, 3, 4],
  [0, 0, 0, 2, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0]
);
const quaternion1 = new THREE.Quaternion();
// quaternion1.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
quaternion1.setFromEuler(new THREE.Euler(0, 0, 0));
const quaternion2 = new THREE.Quaternion();
// quaternion3.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
quaternion2.setFromEuler(new THREE.Euler(Math.PI, 0, 0));
const quaternion3 = new THREE.Quaternion();
// quaternion3.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
quaternion3.setFromEuler(new THREE.Euler(0, 0, 0));
console.log(quaternion1, quaternion2, quaternion3);
const finQ = quaternion1
  .toArray()
  .concat(quaternion2.toArray())
  .concat(quaternion3.toArray());
console.log(finQ);

// //  创建旋转动画帧
const rotationKF = new THREE.QuaternionKeyframeTrack(
  "cube.quaternion",
  [0, 2, 4],
  finQ
);

//布尔关键帧
const boolKF = new THREE.BooleanKeyframeTrack(
  "cube.visible",
  [0, 1, 2, 3, 4],
  [true, false, true, false, true]
);
mixer = new THREE.AnimationMixer(cube);
// 创建动画剪辑
const clip = new THREE.AnimationClip("move", 4, [
  positionKF,
  rotationKF,
  boolKF,
]);
// 创建动画动作
const action = mixer.clipAction(clip);
action.play();
