<template>
  <div>
    <canvas id="c" style="width: 1800px; height: 900px"></canvas>
  </div>
</template>
<script setup>
  import { defineAsyncComponent, onMounted, ref } from 'vue'
  import { Color } from 'three'
  import gsap from 'gsap'
  import {
    currentGlsl,
    createShader,
    createProgram,
    resizeCanvasToDisplaySize
  } from '@/libs/utils.js'
  const vertex = import.meta.glob('/src/views/vertex/*.glsl')
  const fragment = import.meta.glob('/src/views/fragment/*.glsl')
  const initProgram = async gl => {
    const shaderSource = await currentGlsl(5, vertex, fragment)
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

    // _________________________________设置矩阵(像素投影)_______________________________
    // 坐标投影
    // 1. 归1化; [0.1]
    // 2. 缩放; [0,2]
    // 3. 平移; [-1,1]
    // 4. 缩放; y轴旋转一个方向
    const matrixLocation = gl.getUniformLocation(gl.program, 'u_matrix')
    const matrixs1 = new m3.scaling(1 / gl.canvas.width, 1 / gl.canvas.height)
    const matrixs2 = new m3.scaling(2, 2)
    const matrixt1 = new m3.translation(-1, -1)
    const matrixs3 = new m3.scaling(1, -1)
    let matrix = m3.multiply(matrixs2, matrixs1)
    matrix = m3.multiply(matrixt1, matrix)
    matrix = m3.multiply(matrixs3, matrix)
    gl.uniformMatrix3fv(matrixLocation, false, matrix)
    // --------------------------顶点绘制--------------------------------------------
    const cachPoly = new CachPoly(gl)

    // 异步绘制图形
    canvas.addEventListener('mousedown', e => {
      if (e.button === 2) {
        poly && popVertice()
      } else {
        const x = e.pageX - canvas.offsetLeft
        const y = e.pageY - canvas.offsetTop
        if (poly) {
          poly.addVertice(x, y, Math.random() * 10 + 5, 1.0)
        } else {
          createPolygon(x, y, cachPoly, gl)
          poly.addVertice(x, y, Math.random() * 10 + 5, 1.0)
        }
      }
      render(gl, cachPoly)
    })
    canvas.oncontextmenu = function () {
      return false
    }
    canvas.addEventListener('mousemove', e => {
      if (poly) {
        const x = e.pageX - canvas.offsetLeft
        const y = e.pageY - canvas.offsetTop
        poly.setVertice(poly.count - 1, x, y)
        render(gl, cachPoly)
      }
    })
  })
  let poly

  function popVertice() {
    poly.popVertice()
    poly = null
  }
  function createPolygon(x, y, cachPoly, gl) {
    poly = new Poly({
      gl: gl,
      vertices: [x, y, Math.random() * 10 + 5, 1.0],
      types: ['POINTS', 'LINE_STRIP'],
      size: 4
    })
    cachPoly.addPolygon(poly)
  }
  function render(gl, cachPoly) {
    gl.clear(gl.COLOR_BUFFER_BIT)
    cachPoly.draw()
  }
  const defAttr = () => ({
    gl: null,
    vertices: [],
    geoData: [],
    size: 2,
    attrName: 'a_position',
    count: 0,
    types: ['POINTS']
  })

  class Poly {
    constructor(attr) {
      Object.assign(this, defAttr(), attr)
      this.init()
    }
    init() {
      const { gl, size, attrName } = this
      if (!gl) return
      // 创建顶点缓冲区
      const vertexBuffer = gl.createBuffer()
      // 绑定gl的上下文缓冲区对象
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      // 更新缓冲区数据
      this.updateBuffer()
      // 获取shader的变量位置
      const a_position = gl.getAttribLocation(gl.program, attrName)
      gl.vertexAttribPointer(a_position, size, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(a_position)
    }
    /**
     * 添加顶点
     * @param  {...any} params
     * @example 10, 200
     * x: 10, y: 200像素位置
     */
    addVertice(...params) {
      this.vertices.push(...params)
      this.updateBuffer()
    }
    popVertice() {
      const { vertices, size } = this
      const len = vertices.length
      // 删除最后两个数
      vertices.splice(len - size, len)
      // this.updateBuffer()
      this.updateCount()
    }
    setVertice(ind, ...params) {
      // ind 要设置数据的索引(第几个绘图单位,从0开始)
      // params 要设置的数据
      const { vertices, size } = this
      const i = ind * size
      params.forEach((param, paramInd) => {
        vertices[i + paramInd] = param
      })
    }

    updateBuffer() {
      const { gl, vertices } = this
      this.updateCount()
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    }
    updateCount() {
      this.count = this.vertices.length / this.size
    }
    updateVertices(params) {
      // params: ['x','y','pointSize','alpha']
      // geoData是一个数组，包含多个对象，每个对象对应一个绘图单位; 需要在初始化时进行绑定
      const { geoData } = this
      const vertices = []
      geoData.forEach(data => {
        params.forEach(key => {
          vertices.push(data[key])
        })
      })
      this.vertices = vertices
    }
    draw(types = this.types) {
      const { gl, count } = this

      for (let type of types) {
        gl.drawArrays(gl[type], 0, count)
      }
    }
  }
  // 缓存多个多边形
  class CachPoly {
    constructor(gl) {
      this.gl = gl
      this.polygons = []
    }
    addPolygon(polygon) {
      // polygon 是poly对象
      if (!(polygon instanceof Poly)) {
        return console.error('polygon must be instanceof Poly')
      }
      this.polygons.push(polygon)
    }
    updateVertices(params) {
      // params: ['x','y','pointSize','alpha']是geoData中的属性名
      this.polygons.forEach(polygon => {
        polygon.updateVertices(params)
      })
    }
    draw() {
      const { polygons } = this
      for (let polygon of polygons) {
        console.log(polygon)

        polygon.init()
        polygon.draw()
      }
    }
  }
</script>
<style lang="scss" scoped></style>
