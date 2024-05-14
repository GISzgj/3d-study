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
  const initProgram = async gl => {
    const shaderSource = await currentGlsl(20, vertex, fragment)
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
    const source = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1])
    // u_Start 起始点
    // u_End 终点
    // u_Color0 对应起点的颜色
    // u_Color1 对应终点的颜色
    const poly = new Poly({
      source,
      types: ['POINTS', 'TRIANGLE_STRIP'],
      gl,
      attributes: {
        a_position: {
          size: 2,
          index: 0
        }
      },
      uniforms: {
        // 注意坐标系,FragCoord 的坐标系是从左下角开始的
        u_start: {
          type: 'uniform2fv',
          value: [canvas.width * 0.25, canvas.height * 0.75]
        },
        u_end: {
          type: 'uniform2fv',
          value: [canvas.width * 0.75, canvas.height * 0.25]
        },
        u_colorStops: {
          type: 'uniformMatrix4fv',
          value: [
            123000120, 255000, 255255000, 255050, 255000000, 255077, 255255000, 255128, 255000,
            255178, 200, 255255, -1, -1, -1, -1
          ]
        }
      }
    })
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
