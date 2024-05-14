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
// 导入变换控制器
import { TransformControls } from "three/addons/controls/TransformControls.js";
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
  "./model/house/house-scene-min.glb",
  // 加载完成回调
  (gltf) => {
    basicScene = gltf.scene;
  }
);

// 创建变换控制器
let tControls = new TransformControls(camera, renderer.domElement);
tControls.addEventListener("change", animate);
// 监听拖动事件，当拖动物体时候，禁用轨道控制器
tControls.addEventListener("dragging-changed", function (event) {
  controls.enabled = !event.value;
});
tControls.addEventListener("change", () => {
  if (eventObj.isClampGroup) {
    tControls.object.position.y = 0;
  }
});
scene.add(tControls);

let basicScene;
let eventObj = {
  Fullscreen: function () {
    // 全屏
    document.body.requestFullscreen();
    console.log("全屏");
  },
  ExitFullscreen: function () {
    document.exitFullscreen();
    console.log("退出全屏");
  },
  addScene: function () {
    scene.add(basicScene);
  },
  setTranslate: function () {
    tControls.setMode("translate");
  },
  setRotate: function () {
    tControls.setMode("rotate");
  },
  setScale: function () {
    tControls.setMode("scale");
  },
  toggleSpace: function () {
    tControls.setSpace(tControls.space === "local" ? "world" : "local");
  },
  cancelMesh: function () {
    tControls.detach();
  },
  translateSnapNum: null,
  rotateSnapNum: 0,
  scaleSnapNum: 0,
  isClampGroup: false,
  isLight: true,
};
// 创建GUI
const gui = new GUI();
// 添加按钮
// gui.add(eventObj, "Fullscreen").name("全屏");
// gui.add(eventObj, "ExitFullscreen").name("退出全屏");
// 控制立方体的位置
// gui.add(cube.position, "x", -5, 5).name("立方体x轴位置");

gui.add(eventObj, "addScene").name("添加户型基础模型");
gui.add(eventObj, "setTranslate").name("位移模式");
gui.add(eventObj, "setRotate").name("旋转模式");
gui.add(eventObj, "setScale").name("缩放模式");
gui.add(eventObj, "toggleSpace").name("切换空间模式");
gui.add(eventObj, "cancelMesh").name("取消选择");
gui
  .add(eventObj, "isLight")
  .name("是否开启灯光")
  .onChange((value) => {
    if (value) {
      renderer.toneMappingExposure = 1;
    } else {
      renderer.toneMappingExposure = 0.1;
    }
  });
// 监听鼠标按键事件
window.addEventListener("keydown", (event) => {
  // 判断是否按的是t键
  if (event.key === "t") {
    eventObj.setTranslate();
  }
  if (event.key === "r") {
    eventObj.setRotate();
  }
  if (event.key === "s") {
    eventObj.setScale();
  }
});

// 添加物体目录
let meshList = [
  {
    name: "盆栽",
    path: "./model/house/plants-min.glb",
  },
  {
    name: "单人沙发",
    path: "./model/house/sofa_chair_min.glb",
  },
];
let folderAddMehs = gui.addFolder("添加物体");
let sceneMeshes = [];
let meshesNum = {};
meshList.forEach((item) => {
  item.addMesh = function () {
    gltfLoader.load(item.path, (gltf) => {
      sceneMeshes.push({
        ...item,
        object3d: gltf.scene,
      });
      let object3d = gltf.scene;

      scene.add(object3d);
      tControlSelect(object3d);
      let meshOpt = {
        toggleMesh: function () {
          tControlSelect(object3d);
        },
      };
      meshesNum[item.name] = meshesNum[item.name]
        ? meshesNum[item.name] + 1
        : 1;
      meshesFolder
        .add(meshOpt, "toggleMesh")
        .name(item.name + meshesNum[item.name]);
    });
  };
  folderAddMehs.add(item, "addMesh").name(item.name);
});

function tControlSelect(mesh) {
  tControls.attach(mesh);
}

let meshesFolder = gui.addFolder("家居列表");

let snapFolder = gui.addFolder("固定设置");
snapFolder
  .add(eventObj, "translateSnapNum", {
    不固定: null,
    1: 1,
    0.1: 0.1,
    10: 10,
  })
  .name("固定位移设置")
  .onChange(() => {
    tControls.setTranslationSnap(eventObj.translateSnapNum);
  });
snapFolder
  .add(eventObj, "rotateSnapNum", 0, 1)
  .step(0.01)
  .name("旋转")
  .onChange(() => {
    tControls.setRotationSnap(eventObj.rotateSnapNum * Math.PI * 2);
  });
snapFolder
  .add(eventObj, "scaleSnapNum", 0, 2)
  .step(0.1)
  .name("缩放")
  .onChange(() => {
    tControls.setScaleSnap(eventObj.scaleSnapNum);
  });
snapFolder.add(eventObj, "isClampGroup").name("是否吸附到地面");
