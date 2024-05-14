<template>
  <div style="overflow: hidden">
    <canvas id="c" style="width: 100vw; height: 100vh; background-color: brown"></canvas>
  </div>
</template>
<script setup>
  import { nextTick, onMounted, ref } from 'vue'
  import gsap from 'gsap'
  import {
    Matrix3,
    Matrix4,
    Vector3,
    Color,
    OrthographicCamera,
    PerspectiveCamera,
    Quaternion,
    Vector2,
    Spherical
  } from 'three'
  import {
    currentGlsl,
    createShader,
    createProgram,
    resizeCanvasToDisplaySize
  } from '@/libs/utils.js'
  import { Poly } from '@/utils/Poly(verticesSource).js'
  const vertex = import.meta.glob('/src/views/vertex/*.glsl')
  const fragment = import.meta.glob('/src/views/fragment/*.glsl')
  const webGL = import.meta.glob('/src/views/*.vue')
  const initProgram = async gl => {
    const length = Object.values(webGL).length
    const shaderSource = await currentGlsl(length - 1, vertex, fragment)
    const vertexShaderSource = shaderSource.shader
    const fragmentShaderSource = shaderSource.fragment
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)
    return program
  }
  let gl
  let canvas
  let camera
  let pvMatrix
  let target = new Vector3(0, 0, 0)
  onMounted(async () => {
    /** @type {HTMLCanvasElement} */
    canvas = document.querySelector('#c')
    gl = canvas.getContext('webgl2')
    // 开启深度测试
    gl.enable(gl.DEPTH_TEST)
    gl.clearDepth(1.0)
    gl.enable(gl.CULL_FACE)
    resizeCanvasToDisplaySize(gl.canvas)
    const program = await initProgram(gl)
    gl.program = program
    gl.useProgram(program)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    //设置背景色
    gl.clearColor(0, 0, 0, 0)
    const projectionMatrix = new Matrix4()
    const halfH = 1
    const ratio = canvas.width / canvas.height
    const halfW = halfH * ratio
    const [top, bottom, left, right, near, far] = [halfH, -halfH, -halfW, halfW, 0, 2]
    projectionMatrix.makeOrthographic(left, right, top, bottom, near, far)
    camera = new OrthographicCamera(left, right, top, bottom, near, far)
    // 视图矩阵, set的是相机视点
    camera.position.set(0, 0, 1)
    camera.lookAt(target)
    camera.updateWorldMatrix(true)
    // 投影视图矩阵
    pvMatrix = new Matrix4()
    pvMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)

    spherical = new Spherical().setFromVector3(camera.position.clone().sub(target))

    render()
  })
  const crtTriangle = (color, [x, y, z], pvMatrix) => {
    const canvas = gl.canvas
    const poly = new Poly({
      source: new Float32Array([x, 0.3 + y, z, -0.3 + x, -0.3 + y, z, 0.3 + x, -0.3 + y, z]),
      types: ['TRIANGLES'],
      gl,
      attributes: {
        a_position: {
          size: 3,
          index: 0
        }
      },
      uniforms: {
        // 注意坐标系,FragCoord 的坐标系是从左下角开始的
        u_canvasSize: {
          type: 'uniform2fv',
          value: [canvas.width, canvas.height]
        },
        u_pvMatrix: {
          type: 'uniformMatrix4fv',
          value: pvMatrix.elements
        },
        u_color: {
          type: 'uniform4fv',
          value: color
        },
        u_modelMatrix: {
          type: 'uniformMatrix4fv',
          value: new Matrix4().elements
        }
      }
    })
    return poly
  }

  function render(polys) {
    gl.clear(gl.COLOR_BUFFER_BIT)
    if (polys) {
      polys.forEach(poly => {
        gl.clear(gl.DEPTH_BUFFER_BIT)
        poly.init()
        poly.draw()
      })
    } else {
      const triangle1 = crtTriangle([1, 0, 0, 1], [-0.5, 0, -0.3], pvMatrix)
      const triangle2 = crtTriangle([1, 0, 0, 1], [0.5, 0, -0.3], pvMatrix)
      const triangle3 = crtTriangle([1, 1, 0, 1], [-0.5, 0, -0.2], pvMatrix)
      const triangle4 = crtTriangle([1, 1, 0, 1], [0.5, 0, -0.2], pvMatrix)
      const polys = [triangle1, triangle2, triangle3, triangle4]
      render(polys)
    }
  }

  // 轨道控制器
  // 声明变量
  // 鼠标事件集合
  const mouseButtons = new Map([
    [2, 'pan'],
    [0, 'rotate']
  ])
  console.log(mouseButtons.get(2))
  // 轨道控制器的状态
  let state = 'none'
  // 鼠标在屏幕上的起始和结束
  const dragStart = new Vector2()
  const dragEnd = new Vector2()
  // 鼠标的偏移量; xyz 三个轴
  const panOffset = new Vector3()
  // 相机视点相对于目标的球坐标
  let spherical
  // 事件监听
  onMounted(() => {
    const canvas = gl.canvas
    canvas.addEventListener('contextmenu', e => e.preventDefault())
    canvas.addEventListener('pointerdown', e => {
      const { button, clientX, clientY } = e
      dragStart.set(clientX, clientY)
      state = mouseButtons.get(button)
    })
    canvas.addEventListener('pointermove', e => {
      const { clientX, clientY } = e
      dragEnd.set(clientX, clientY)
      // 鼠标滑动一点的位移
      const dragVector = dragEnd.clone().sub(dragStart)
      switch (state) {
        case 'pan':
          pan(dragVector)
          break
        case 'rotate':
          rotate(dragVector)
          break
        default:
          break
      }
      dragStart.copy(dragEnd)
    })
    canvas.addEventListener('pointerup', e => {
      // 置空
      state = 'none'
    })
  })
  const pan = ({ x, y }) => {
    const { clientWidth, clientHeight } = gl.canvas
    // 鼠标在画布的偏移
    const ratioW = x / clientWidth
    const ratioH = y / clientHeight
    // 相机的偏移
    const cameraW = camera.right - camera.left
    const cameraH = camera.top - camera.bottom
    const distanceX = cameraW * ratioW
    const distanceY = cameraH * ratioH
    // 对相机进行移动, 本地坐标系的移动
    const mx = new Vector3().setFromMatrixColumn(camera.matrix, 0)
    const my = new Vector3().setFromMatrixColumn(camera.matrix, 1)
    mx.multiplyScalar(-distanceX)
    my.multiplyScalar(distanceY)
    panOffset.copy(mx.add(my))
    console.log(panOffset)

    // camera.position.x -= distanceX
    // camera.position.y += distanceY

    camera.position.add(panOffset)
    target.add(panOffset)
    update()
  }
  const rotate = ({ x, y }) => {
    const { clientWidth, clientHeight } = gl.canvas
    // 计算旋转角度
    const ratioX = x / clientHeight
    const ratioY = y / clientHeight
    const angleX = ratioX * Math.PI * 2
    const angleY = ratioY * Math.PI * 2
    spherical.theta -= angleX
    spherical.phi -= angleY
    const rotateOffset = new Vector3().setFromSpherical(spherical)
    camera.position.copy(target.clone().add(rotateOffset))
    update()
  }
  function update() {
    //基于平移量平移相机
    // target.add(panOffset)
    // camera.position.add(panOffset)

    //基于旋转量旋转相机

    //更新投影视图矩阵
    camera.lookAt(target)
    camera.updateMatrixWorld(true)
    pvMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)

    //重置旋转量和平移量
    spherical.setFromVector3(camera.position.clone().sub(target))
    panOffset.set(0, 0, 0)
    // 渲染
    render()
  }
</script>
<style lang="scss" scoped></style>
