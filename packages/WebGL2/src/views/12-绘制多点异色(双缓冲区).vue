<template>
  <div>
    <canvas id="c" style="width: 100%; height: 100%; background-color: brown"></canvas>
  </div>
</template>
<script setup>
  import { onMounted, ref, render } from 'vue'
  import gsap from 'gsap'
  import { Matrix3, Matrix4, Vector3 } from 'three'
  import {
    currentGlsl,
    createShader,
    createProgram,
    resizeCanvasToDisplaySize
  } from '@/libs/utils.js'
  import { Quadtree, Rectangle } from '@/utils/Quadtree.js'
  import { Poly, CachPoly } from '@/utils/Poly.js'
  const vertex = import.meta.glob('/src/views/vertex/*.glsl')
  const fragment = import.meta.glob('/src/views/fragment/*.glsl')
  const initProgram = async gl => {
    const shaderSource = await currentGlsl(11, vertex, fragment)
    const vertexShaderSource = shaderSource.shader
    const fragmentShaderSource = shaderSource.fragment
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)
    return program
  }
  /* x,z 方向的空间坐标极值 */
  const [minPosX, maxPosX, minPosZ, maxPosZ] = [-0.7, 0.8, -1, 1]
  const [minAngX, maxAngX, minAngZ, maxAngZ] = [0, Math.PI * 4, 0, Math.PI * 2]
  onMounted(async () => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector('#c')

    const gl = canvas.getContext('webgl2')
    // 开启混合能力
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    resizeCanvasToDisplaySize(gl.canvas)
    const program = await initProgram(gl)
    gl.program = program
    gl.useProgram(program)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    //设置背景色
    gl.clearColor(0, 0, 0, 0)
    const wave = createPoly(gl)
    wave.updateBuffer()
    const color = createColor(gl)
    wave.draw()
  })
  // 图形实例
  function createPoly(gl) {
    // 设置视图矩阵
    const viewMatrix = new Matrix4().lookAt(
      new Vector3(0.0, 0.0, 0.0),
      new Vector3(),
      new Vector3(0, 1, 0)
    )
    // 设置模型矩阵
    const modelMatrix = new Matrix4()
    const vertices = [0.1, 0.1, 1.0, 0.5, 0.5, 1.0, -0.5, -0.5, 1.0]
    const wave = new Poly({
      gl,
      vertices,
      uniforms: {
        u_viewMatrix: {
          type: 'uniformMatrix4fv',
          value: viewMatrix.elements
        }
      }
    })
    return wave
  }
  function createColor(gl) {
    const colorData = [1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1]
    const color = new Poly({
      gl,
      attrName: 'a_color',
      vertices: colorData
    })
    return color
  }
  /* 正弦函数 */
  function SinFn(a, Omega, phi) {
    return function (x) {
      return a * Math.sin(Omega * x + phi)
    }
  }
  //线性比例尺
  function ScaleLinear(ax, ay, bx, by) {
    const delta = {
      x: bx - ax,
      y: by - ay
    }
    const k = delta.y / delta.x
    const b = ay - ax * k
    return function (x) {
      return k * x + b
    }
  }
</script>
<style lang="scss" scoped></style>
