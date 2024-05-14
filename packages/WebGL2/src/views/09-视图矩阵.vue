<template>
  <div>
    <canvas id="c" style="width: 1800px; height: 900px; background-color: brown"></canvas>
  </div>
</template>
<script setup>
  import { onMounted, ref } from 'vue'
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
    const shaderSource = await currentGlsl(8, vertex, fragment)
    const vertexShaderSource = shaderSource.shader
    const fragmentShaderSource = shaderSource.fragment
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)
    return program
  }
  // poly: 当前绘制的图形
  let poly
  // 缓存所有绘制的图形
  let cachPoly
  // 四叉树, 记录所有图形的点信息,建立四叉树模型
  let quadtree
  // 鼠标移动点建立的矩形
  let movePointRec
  // 鼠标移动到图形上的点
  let mousePoint
  // 闪烁动画
  let tiemLine = []
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
    const viewMatrix = getViewMatrix(
      new Vector3(0.2, 0.5, 0.2),
      new Vector3(0.0, 0.0, 0.1),
      new Vector3(0, 1, 0)
    )
    console.log(new Vector3(0.0, 0.5, 0.5))
    // 设置投影矩阵
    gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix)
    console.log(viewMatrix)
    createPoly(gl)
    poly.draw()
  })
  function createPoly(gl) {
    var vertices = [
      // 前
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

      // 后
      -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

      // 上
      -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

      // 下
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

      // 右
      1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

      // 左
      -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
    ]

    poly = new Poly({
      gl,
      vertices: vertices.map(item => item * 0.5),
      size: 3,
      // types: ['TRIANGLES']
      types: ['LINE_STRIP']
    })
  }
  function getViewMatrix(e, t, u) {
    //基向量c，视线
    const c = new Vector3().subVectors(e, t).normalize()
    //基向量a，视线和上方向的垂线
    const a = new Vector3().crossVectors(u, c).normalize()
    //基向量b，修正上方向
    const b = new Vector3().crossVectors(c, a).normalize()
    //正交旋转矩阵
    const mr = new Matrix4().set(...a, 0, ...b, 0, -c.x, -c.y, -c.z, 0, 0, 0, 0, 1)
    //位移矩阵
    const mt = new Matrix4().set(1, 0, 0, -e.x, 0, 1, 0, -e.y, 0, 0, 1, -e.z, 0, 0, 0, 1)
    return mr.multiply(mt).elements
  }
</script>
<style lang="scss" scoped></style>
