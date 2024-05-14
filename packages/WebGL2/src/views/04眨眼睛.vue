<template>
  <div>
    <canvas
      id="c"
      style="
        width: 1800px;
        height: 900px;
        background: url('/stars.jpg');
        background-position: left bottom;
        background-repeat: no-repeat;
        background-size: cover;
      "
    ></canvas>
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
    const shaderSource = await currentGlsl(3, vertex, fragment)
    const vertexShaderSource = shaderSource.shader
    const fragmentShaderSource = shaderSource.fragment
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)
    return program
  }
  class SetGlData {
    constructor(gl, program) {
      this.gl = gl
      this.program = program
      this.positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
      this.sizeAttributeLocation = gl.getAttribLocation(program, 'a_pointSize')
      this.colorAttributeLocation = gl.getAttribLocation(program, 'a_color')
      this.sizeBuffer = gl.createBuffer()
      this.positionBuffer = gl.createBuffer()
      this.colorBuffer = gl.createBuffer()
      this.dataArray = []
      this.init({
        x: 100,
        y: 100,
        s: 15,
        r: 1,
        g: 0,
        b: 0,
        a: 1
      })
    }
    useData(data) {
      if (data) {
        this.dataArray.push(data)
      }
      this.setData(
        this.dataArray.reduce((result, current) => {
          result.push(current.x, current.y)
          return result
        }, []),
        this.positionBuffer
      )
      this.setData(
        this.dataArray.reduce((result, current) => {
          result.push(current.s)
          return result
        }, []),
        this.sizeBuffer
      )
      this.setData(
        this.dataArray.reduce((result, current) => {
          result.push(current.a)
          return result
        }, []),
        this.colorBuffer
      )
    }
    setData(data, bufferType) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferType)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW)
    }
    startDataAttribute(location, size, type, normalize, stride, offset) {
      // 开启顶点数据的批处理功能。
      this.gl.enableVertexAttribArray(location)
      this.gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
    }
    init(data) {
      if (data) {
        this.dataArray.push(data)
      }
      this.setData(
        this.dataArray.reduce((result, current) => {
          result.push(current.x, current.y)
          return result
        }, []),
        this.positionBuffer
      )
      this.startDataAttribute(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)
      this.setData(
        this.dataArray.reduce((result, current) => {
          result.push(current.s)
          return result
        }, []),
        this.sizeBuffer
      )
      this.startDataAttribute(this.sizeAttributeLocation, 1, this.gl.FLOAT, false, 0, 0)
      this.setData(
        this.dataArray.reduce((result, current) => {
          result.push(current.a)
          return result
        }, []),
        this.colorBuffer
      )
      this.startDataAttribute(this.colorAttributeLocation, 1, this.gl.FLOAT, false, 0, 0)
    }
  }
  onMounted(async () => {
    const canvas = document.querySelector('#c')
    const canvasWidth = canvas.clientLeft
    const canvasHeight = canvas.clientTop
    canvas.addEventListener('click', e => {
      const clientHeight = e.clientY
      const clientWidth = e.clientX
      const [cssX, cssY] = [clientWidth - canvasWidth, clientHeight - canvasHeight]
      drawPoint(cssX, cssY)
      useAnamitation()
    })
    function useAnamitation() {
      const length = glData.dataArray.length
      let data = glData.dataArray[length - 1]
      gsap.to(data, {
        duration: 1,
        x: data.x - 3 * (Math.random() * 2 - 1),
        y: data.y + 3 * (Math.random() * 2 - 1),
        a: 0,
        ease: 'power1.out',
        repeat: -1,
        yoyo: true,
        onUpdate: () => {
          glData.useData()
          gl.drawArrays(gl.POINTS, 0, length)
        }
      })
    }
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

    // _________________________________设置矩阵_______________________________
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
    // _________________________________设置顶点_______________________________

    const glData = new SetGlData(gl, program)
    gl.drawArrays(gl.POINTS, 0, 1)
    useAnamitation()
    // 绘制一个点 从第一个顶点绘制3个点
    function drawPoint(left, top) {
      gl.clearColor(0, 0, 0, 0.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      glData.useData({
        x: left,
        y: top,
        s: Math.random() * 10 + 5,
        a: Math.random() * 0.5 + 0.5
      })
      gl.drawArrays(gl.POINTS, 0, glData.dataArray.length)
    }
  })
</script>
<style lang="scss" scoped></style>
