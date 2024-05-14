<template>
  <div>
    <canvas id="c" style="width: 1800px; height: 900px; background-color: brown"></canvas>
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
    const shaderSource = await currentGlsl(9, vertex, fragment)
    const vertexShaderSource = shaderSource.shader
    const fragmentShaderSource = shaderSource.fragment
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)
    return program
  }
  onMounted(async () => {
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
    gl.clear(gl.COLOR_BUFFER_BIT)
    // 设置视图矩阵
    const uViewMatrix = gl.getUniformLocation(gl.program, 'u_viewMatrix')
    const viewMatrix = new Matrix4().lookAt(
      new Vector3(0.2, 0.2, 1.0),
      new Vector3(0.0, 0.0, 0.0),
      new Vector3(0, 1, 0)
    )
    gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix.elements)
    // 设置模型矩阵
    const uModelMatrix = gl.getUniformLocation(gl.program, 'u_modelMatrix')
    const modelMatrix = new Matrix4().makeRotationX(Math.PI / 5)
    // 绘制图形
    const len = createPoly(gl)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.LINE_STRIP, 0, len)
    let angle = 0
    !(function ani() {
      angle += 0.02
      modelMatrix.makeRotationX(angle)
      gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix.elements)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.LINES, 0, len)
      requestAnimationFrame(ani)
    })()
  })
  function createPoly(gl) {
    const verticeLib = [
      1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
      -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0
    ]
    const indices = [
      0, 1, 1, 2, 2, 3, 3, 0,

      0, 5, 1, 6, 2, 7, 3, 4,

      4, 5, 5, 6, 6, 7, 7, 4
    ]
    const arr = []
    indices.forEach(n => {
      const i = n * 3
      arr.push(verticeLib[i] / 5, verticeLib[i + 1] / 5, verticeLib[i + 2] / 5)
    })
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW)
    const a_position = gl.getAttribLocation(gl.program, 'a_position')
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_position)
    return indices.length
  }
</script>
<style lang="scss" scoped></style>
