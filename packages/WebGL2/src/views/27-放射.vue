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
    const source = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1])
    const colorStops = [
      {
        color: [123, 0, 123, 255],
        stop: 0
      },
      {
        color: [255, 0, 0, 255],
        stop: 0.2
      },
      {
        color: [255, 255, 0, 255],
        stop: 0.4
      },
      {
        color: [0, 255, 0, 255],
        stop: 0.6
      },
      {
        color: [0, 0, 200, 255],
        stop: 0.8
      },
      {
        color: [123, 0, 123, 255],
        stop: 1
      }
    ]
    // u_Start 起始点
    // u_End 终点
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
          value: [canvas.width / 2, canvas.height / 2]
        },
        u_ang: {
          type: 'uniform1fv',
          value: [0]
        },
        u_canvasSize: {
          type: 'uniform2fv',
          value: [canvas.width, canvas.height]
        }
      }
    })
    gl.clear(gl.COLOR_BUFFER_BIT)
    poly.draw()
    let ang = 1
    !(function ani() {
      ang++
      poly.uniforms.u_ang.value = [ang]
      poly.updateUniform()
      gl.clear(gl.COLOR_BUFFER_BIT)
      poly.draw()
      requestAnimationFrame(ani)
    })()
  }

  /* 解析渐变节点 */
  function parseColorStops(source) {
    const stops = new Array(16).fill(-1)
    source.forEach(({ color, stop }, stopInd) => {
      let rgb = ''
      let ar = ''
      color.forEach((ele, ind) => {
        //1 1001 '1001' '001'
        const str = (ele + 1000).toString().slice(1)
        if (ind < 3) {
          rgb += str
        } else {
          ar += str
        }
      })
      ar += (Math.round(stop * 255) + 1000).toString().slice(1)
      stops[stopInd * 2] = rgb
      stops[stopInd * 2 + 1] = ar
    })
    return stops
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
