<template>
  <div>
    <canvas id="c" style="width: 1800px; height: 900px; background: #fff"></canvas>
  </div>
</template>
<script setup>
  import { defineAsyncComponent, onMounted, ref } from 'vue'
  import { Color } from 'three'
  import * as cuonMatrix from 'cuon-matrix'
  import { currentGlsl, createShader, createProgram } from '@/libs/utils.js'
  const vertex = import.meta.glob('/src/views/vertex/*.glsl')
  const fragment = import.meta.glob('/src/views/fragment/*.glsl')
  function setPointBufferData(gl, left, top) {
    const n = 3
    const data = [30, 50, 50, 70, 80, 150]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)

    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([left, top]), gl.STATIC_DRAW)

    return data
  }
  function setPointSize(gl) {
    const data = [40.0, 40.0, 30.0]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    return data
  }
  function setColor(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 0]), gl.STATIC_DRAW)
    return 3
  }
  function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1
    const width = (canvas.clientWidth * multiplier) | 0
    const height = (canvas.clientHeight * multiplier) | 0
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      return true
    }
    return false
  }
  function degToRad(d) {
    return (d * Math.PI) / 180
  }
  const initProgram = async gl => {
    const shaderSource = await currentGlsl(2, vertex, fragment)
    const vertexShaderSource = shaderSource.shader
    const fragmentShaderSource = shaderSource.fragment
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)
    return program
  }
  onMounted(async () => {
    var canvas = document.querySelector('#c')
    const canvasWidth = canvas.clientLeft
    const canvasHeight = canvas.clientTop
    canvas.addEventListener('click', e => {
      const clientHeight = e.clientY
      const clientWidth = e.clientX
      const [cssX, cssY] = [clientWidth - canvasWidth, clientHeight - canvasHeight]
      drawPoint(cssX, cssY)
    })
    const gl = canvas.getContext('webgl2')
    resizeCanvasToDisplaySize(gl.canvas)
    const program = await initProgram(gl)

    gl.program = program

    gl.useProgram(program)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    //设置背景色
    gl.clearColor(0, 50, 50, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    // _________________________________设置顶点_______________________________

    // 将缓冲区对象分配给a_Position变量
    const positionAttributeLocation = gl.getAttribLocation(gl.program, 'a_position')
    // =============顶点数组对象-----------------
    // var vao = gl.createVertexArray()
    // gl.bindVertexArray(vao)
    // =============顶点数组对象-----------------
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    const data = setPointBufferData(gl)
    // 开启顶点数据的批处理功能。  连接a_position变量和分配给它的缓冲区对象
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
    // _________________________________设置顶点尺寸____________________________________________________
    const sizeAttributeLocation = gl.getAttribLocation(gl.program, 'a_pointSize')
    // 创建缓冲区对象
    const sizeBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
    const sizeData = setPointSize(gl)
    // 开启顶点数据的批处理功能。
    gl.enableVertexAttribArray(sizeAttributeLocation)
    gl.vertexAttribPointer(sizeAttributeLocation, 1, gl.FLOAT, false, 0, 0)

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

    // _________________________________设置颜色_______________________________
    // const colorLocation = gl.getUniformLocation(gl.program, 'u_color')
    // const color = [Math.random(), Math.random(), Math.random(), 1]
    // gl.uniform4fv(colorLocation, color)
    const colorAttributeLocation = gl.getAttribLocation(program, 'a_color')
    const colorBuffer = gl.createBuffer()
    // 绑定颜色缓冲区对象到当前gl上下文,后续对缓冲区的操作都会影响这个缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    setColor(gl)
    // 开启顶点数据的批处理功能。
    gl.enableVertexAttribArray(colorAttributeLocation)
    const normalize = true // convert from 0-255 to 0.0-1.0
    // 将缓冲区对象分配给一个attribute对象gl.vertexAttribPointer()
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.UNSIGNED_BYTE, normalize, 0, 0)
    // 绘制一个点 从第一个顶点绘制3个点
    gl.drawArrays(gl.POINTS, 0, 3)
    function drawPoint(left, top) {
      gl.clearColor(0, 50, 50, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      data.push(left)
      data.push(top)
      console.log(data)

      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(data),

        gl.STATIC_DRAW
      )

      sizeData.push(Math.random() * 20 + 5)
      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizeData), gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint8Array([Math.random() * 255, Math.random() * 255, Math.random() * 255, 1]),
        gl.STATIC_DRAW
      )

      gl.drawArrays(gl.POINTS, 0, data.length / 2)
    }
  })
</script>
<style lang="scss" scoped></style>
