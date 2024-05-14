<template>
  <div>
    <canvas id="c" style="width: 100%; height: 100%; background-color: brown"></canvas>
  </div>
</template>
<script setup>
  import { onMounted, ref, render } from 'vue'
  import gsap from 'gsap'
  import { Matrix3, Matrix4, Vector3, Color } from 'three'
  import {
    currentGlsl,
    createShader,
    createProgram,
    resizeCanvasToDisplaySize
  } from '@/libs/utils.js'
  import { Quadtree, Rectangle } from '@/utils/Quadtree.js'
  import { Poly } from '@/utils/Poly(verticesSource).js'
  // import { Poly, CachPoly } from '@/utils/Poly.js'
  const vertex = import.meta.glob('/src/views/vertex/*.glsl')
  const fragment = import.meta.glob('/src/views/fragment/*.glsl')
  const initProgram = async gl => {
    const shaderSource = await currentGlsl(13, vertex, fragment)
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
  // 建立将y坐标和色相相映射的比例尺
  /* y 方向的坐标极值 */
  const [a1, a2] = [0.1, 0.03]
  const a12 = a1 + a2
  const [minY, maxY] = [-a12, a12]
  /* 色相极值 */
  const [minH, maxH] = [0.15, 0.55]
  const [rows, cols] = [50, 50]
  /* 比例尺：将y坐标和色相相映射 */
  const scalerC = ScaleLinear(minY, minH, maxY, maxH)
  const color = new Color()
  onMounted(async () => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector('#c')
    const gl = canvas.getContext('webgl2')
    // 开启混合能力
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    resizeCanvasToDisplaySize(gl.canvas)
    const program = await initProgram(gl)
    gl.program = program
    gl.useProgram(program)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    //设置背景色
    gl.clearColor(0, 0, 0, 0)
    //获取索引位置的方法
    let categorySize = 7
    const getInd = GetIndexInGrid(cols, categorySize)
    /* 获取基础数据
         vertices 按照行列形式排列的顶点集合
         indexes 三角网格的顶点索引，其元素为顶点在vertices中的索引
      */
    const { vertices, indexes } = crtBaseData(cols, rows, getInd)
    const wave = createPoly(gl, vertices, indexes)
    /* 动画:偏移phi */
    let offset = 0

    !(function ani() {
      offset += 0.08
      // updateVertices(wave, gl, offset)
      gl.clear(gl.COLOR_BUFFER_BIT)
      updateVertices(wave, gl, offset)
      wave.updateAttribute()
      wave.draw()
      requestAnimationFrame(ani)
    })()
  })
  // 图形实例
  function createPoly(gl, vertices, indexes) {
    // 设置视图矩阵
    const viewMatrix = new Matrix4().lookAt(
      new Vector3(0.2, 0.3, 1),
      new Vector3(),
      new Vector3(0, 1, 0)
    )
    // 设置模型矩阵
    const modelMatrix = new Matrix4()
    const source = new Float32Array(getSource(vertices, indexes, 7))
    // console.log(source)
    const types = ['LINES', 'TRIANGLES']
    const wave = new Poly({
      gl,
      types,
      source,
      elementBytes: source.BYTES_PER_ELEMENT,
      attributes: {
        a_position: { size: 3, index: 0 },
        a_color: { size: 4, index: 3 }
      },
      uniforms: {
        u_viewMatrix: {
          type: 'uniformMatrix4fv',
          value: viewMatrix.elements
        }
      }
    })
    return wave
  }
  /* 建立顶点集合 */
  function getSource(vertices, indexes, categorySize) {
    const arr = []
    indexes.forEach(i => {
      arr.push(...vertices.slice(i, i + categorySize))
    })
    return arr
  }
  /* 建立基础数据 */
  function crtBaseData(cols, rows, getInd) {
    const vertices = []
    const indexes = []
    const spaceZ = (maxPosZ - minPosZ) / rows
    const spaceX = (maxPosX - minPosX) / cols
    for (let z = 0; z < rows; z++) {
      for (let x = 0; x < cols; x++) {
        const px = x * spaceX + minPosX
        const pz = z * spaceZ + minPosZ
        vertices.push(px, 0, pz, 1, 1, 1, 0.5)
        if (z && x) {
          const [x0, z0] = [x - 1, z - 1]
          indexes.push(
            getInd(x0, z0),
            getInd(x, z0),
            getInd(x, z),
            getInd(x0, z0),
            getInd(x, z),
            getInd(x0, z)
          )
        }
      }
    }
    return { vertices, indexes }
  }
  // 塑性更新顶点高度
  function updateVertices(wave, gl, offset) {
    const { source, categorySize } = wave
    for (let i = 0; i < source.length; i += categorySize) {
      const [posX, posZ] = [source[i], source[i + 2]]
      const scalerX = ScaleLinear(minPosX, minAngX, maxPosX, maxAngX)
      const scalerZ = ScaleLinear(minPosZ, minAngZ, maxPosZ, maxAngZ)
      const angZ = scalerZ(posZ)
      const Omega = 2
      // const a = 0.05
      // const phi = 0
      const a = Math.sin(angZ) * 0.1 + 0.03
      const phi = scalerX(posX)
      const y = SinFn(a, Omega, phi)(angZ + offset * 0.5)
      source[i + 1] = y
      const h = scalerC(y)
      const { r, g, b } = color.setHSL(h, 1, 0.6)
      source[i + 3] = r
      source[i + 4] = g
      source[i + 5] = b
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
  /* GetIndexInGrid
    在由一维数组建立的栅格矩阵中，基于行列获取顶点元素的索引位置
    @param w 栅格矩阵的列数
    @param size 每个顶点的数据个数
  */
  function GetIndexInGrid(w, size) {
    /**
     * @param x 列数
     * @param y 行数
     */
    return function (x, y) {
      return (y * w + x) * size
    }
  }
</script>
<style lang="scss" scoped></style>
