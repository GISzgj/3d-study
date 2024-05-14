<template>
  <div style="overflow: hidden">
    <canvas id="c" style="width: 100vw; height: 100vh; background-color: brown"></canvas>
  </div>
</template>
<script setup>
  import { onMounted, ref } from 'vue'
  import gsap from 'gsap'
  import { Matrix3, Matrix4, Vector3, Color } from 'three'
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
    // 开启深度测试
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    resizeCanvasToDisplaySize(gl.canvas)
    const program = await initProgram(gl)
    gl.program = program
    gl.useProgram(program)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    //设置背景色
    gl.clearColor(0, 0, 0, 0)
    createPolyOne()
    getData()
  })
  const createPolyOne = () => {
    const canvas = gl.canvas
    const source = new Float32Array([0, 0.3, -0.2, -0.3, -0.3, -0.2, 0.3, -0.3, -0.2])
    const projectionMatrix = new Matrix4()
    const poly = new Poly({
      source,
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
        u_projectionMatrix: {
          type: 'uniformMatrix4fv',
          value: projectionMatrix.elements
        }
      }
    })
    // 没有应用正交投影矩阵三角形会被拉伸
    render(poly)
    // 正交投影矩阵
    // 定义相机世界高度尺寸的一半
    const halfH = 1
    const ratio = canvas.width / canvas.height
    const halfW = halfH * ratio
    console.log(ratio)

    const [top, bottom, left, right, near, far] = [halfH, -halfH, -halfW, halfW, 0, 2]
    projectionMatrix.makeOrthographic(left, right, top, bottom, near, far)
    poly.uniforms.u_projectionMatrix.value = projectionMatrix.elements
    poly.updateUniform()
    render(poly)
  }

  function render(poly) {
    gl.clear(gl.COLOR_BUFFER_BIT)
    poly.draw()
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
