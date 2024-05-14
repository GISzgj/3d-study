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
    const shaderSource = await currentGlsl(10, vertex, fragment)
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
    /* 动画:偏移phi */
    let offset = 0
    !(function ani() {
      offset += 0.08
      updateVertices(wave, gl, offset)
      wave.updateBuffer()
      gl.clear(gl.COLOR_BUFFER_BIT)
      wave.draw()
      requestAnimationFrame(ani)
    })()
  })
  // 图形实例
  function createPoly(gl) {
    // 设置视图矩阵
    const viewMatrix = new Matrix4().lookAt(
      new Vector3(0.2, 0.3, 1),
      new Vector3(),
      new Vector3(0, 1, 0)
    )
    // 设置模型矩阵
    const modelMatrix = new Matrix4()
    const vertices = crtPolyData()
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
  // 布点
  function crtPolyData() {
    const vertices = []
    for (let z = minPosZ; z < maxPosZ; z += 0.04) {
      for (let x = minPosX; x < maxPosX; x += 0.05) {
        vertices.push(x, 0, z)
      }
    }
    return vertices
  }
  // 塑性更新顶点高度
  function updateVertices(wave, gl, offset) {
    const { vertices } = wave
    for (let i = 0; i < vertices.length; i += 3) {
      const [posX, posZ] = [vertices[i], vertices[i + 2]]
      const scalerX = ScaleLinear(minPosX, minAngX, maxPosX, maxAngX)
      const scalerZ = ScaleLinear(minPosZ, minAngZ, maxPosZ, maxAngZ)
      const angZ = scalerZ(posZ)
      const Omega = 2
      // const a = 0.05
      // const phi = 0
      const a = Math.sin(angZ) * 0.1 + 0.03
      const phi = scalerX(posX)
      vertices[i + 1] = SinFn(a, Omega, phi)(angZ + offset * 0.5)
    }
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
