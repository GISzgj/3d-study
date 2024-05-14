<template>
  <div style="overflow: hidden">
    <canvas id="c" style="width: 100vw; height: 100vh; background-color: brown"></canvas>
  </div>
</template>
<script setup>
  import { onMounted, ref } from 'vue'
  import gsap from 'gsap'
  import { Matrix3, Matrix4, Vector3, Color, OrthographicCamera, PerspectiveCamera } from 'three'
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
  onMounted(async () => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector('#c')
    gl = canvas.getContext('webgl2')
    canvas.addEventListener('pointerdown', e => {
      console.log(e)
    })
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
    const [fov, aspect, near, far] = [45, canvas.width / canvas.height, 1, 20]
    const camera = new PerspectiveCamera(fov, aspect, near, far)
    // 视图矩阵, set的是相机视点
    camera.position.set(0, 0, 1)
    camera.lookAt(new Vector3(0, 0, 0.0))
    camera.updateWorldMatrix(true)
    // 投影视图矩阵
    const pvMatrix = new Matrix4()
    pvMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    // matrixWorldInverse 视图矩阵, set的是相机视点
    const triangle1 = crtTriangle([1, 0, 0, 1], [-0.5, 0, -0.3], pvMatrix)
    const triangle2 = crtTriangle([1, 0, 0, 1], [0.5, 0, -0.3], pvMatrix)
    const triangle3 = crtTriangle([1, 1, 0, 1], [-0.5, 0, -0.2], pvMatrix)
    const triangle4 = crtTriangle([1, 1, 0, 1], [0.5, 0, -0.2], pvMatrix)
    render([triangle1, triangle2, triangle3, triangle4])
    getData()
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
        console.log(poly)

        poly.init()
        poly.draw()
      })
    }
  }
  function getData() {
    const canvas = gl.canvas
    const pixel = new Uint8Array(4)
    // 从画布中采集一个像素出来
    gl.readPixels(canvas.width / 2, canvas.height / 2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)
    console.log(pixel)
    return pixel
  }
</script>
<style lang="scss" scoped></style>
