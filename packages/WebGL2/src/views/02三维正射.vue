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
  let rotateGl = ref(0)
  const vertex = import.meta.glob('/src/views/vertex/*.glsl')
  const fragment = import.meta.glob('/src/views/fragment/*.glsl')
  // 使用组成 'F' 的数据填充当前 ARRAY_BUFFER 缓冲
  function setGeometry(gl) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // 左竖
        0, 0, 0, 30, 0, 0, 0, 150, 0, 0, 150, 0, 30, 0, 0, 30, 150, 0,

        // 上横
        30, 0, 0, 100, 0, 0, 30, 30, 0, 30, 30, 0, 100, 0, 0, 100, 30, 0,

        // 下横
        30, 60, 0, 67, 60, 0, 30, 90, 0, 30, 90, 0, 67, 60, 0, 67, 90, 0
      ]),
      gl.STATIC_DRAW
    )
  }
  const projection = function (width, height, depth) {
    // 注意：这个矩阵翻转了 Y 轴，所以 0 在上方
    return [2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 2 / depth, 0, -1, 1, 0, 1]
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

  async function useShader(gl) {
    const shaderSource = await currentGlsl(1, vertex, fragment)
    const vertexShaderSource = shaderSource.shader
    const fragmentShaderSource = shaderSource.fragment
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)

    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    var program = createProgram(gl, vertexShader, fragmentShader)
    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, 'a_position')

    // look up uniform locations
    var resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
    var colorLocation = gl.getUniformLocation(program, 'u_color')
    const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
    // Create a buffer
    var positionBuffer = gl.createBuffer()

    // Create a vertex array object (attribute state)
    var vao = gl.createVertexArray()
    // and make it the one we're currently working with
    gl.bindVertexArray(vao)
    // 开启顶点数据的批处理功能。
    gl.enableVertexAttribArray(positionAttributeLocation)
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    var size = 3 // 每次迭代使用 3 个单位的数据
    var type = gl.FLOAT // 单位数据类型是32位的浮点型
    var normalize = false // 不需要归一化数据
    var stride = 0 // 0 = 移动距离 * 单位距离长度sizeof(type)  每次迭代跳多少距离到下一个数据
    var offset = 0 // 从绑定缓冲的起始处开始
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

    function radToDeg(r) {
      return (r * 180) / Math.PI
    }

    function degToRad(d) {
      return (d * Math.PI) / 180
    }

    var translation = [45, 150, 0]
    var rotation = [degToRad(40), degToRad(25), degToRad(325)]
    var scale = [1, 1, 1]
    let moveOrigin = [-50, -75]
    // setRectangle(gl, translation[0], translation[1], width, height)
    setGeometry(gl)
    const thColor = new Color('rgba(255,0,0,1)')
    draw()
    //     使用缓冲区对象向顶点着色器传入多个点
    // 1. 创建缓冲区对象gl.createBuffer()
    // 2. 绑定缓冲区对象gl.bindBuffer()
    // 3. 将数据写入缓冲区对象gl.bufferData()
    // 4. 将缓冲区对象分配给一个attribute对象gl.vertexAttribPointer()
    // 开启顶点数据的批处理功能。
    // 5. 开启attribute变量 gl.enableVertexAttribArray()
    function draw() {
      resizeCanvasToDisplaySize(gl.canvas)
      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      // rgba
      gl.clearColor(thColor.r, thColor.g, thColor.b, 1)
      thColor.offsetHSL(0.005, 0, 0, 1)
      console.log(thColor)

      gl.clear(gl.COLOR_BUFFER_BIT)
      // Tell it to use our program (pair of shaders)
      gl.useProgram(program)
      // Bind the attribute/buffer set we want.
      gl.bindVertexArray(vao)
      // Pass in the canvas resolution so we can convert from

      // Update the position buffer with rectangle positions
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      // pixels to clipspace in the shader
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)
      // 计算矩阵
      var matrix = projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400)
      matrix = m4.translate(matrix, translation[0], translation[1], translation[2])
      matrix = m4.xRotate(matrix, rotation[0])
      matrix = m4.yRotate(matrix, rotation[1])
      matrix = m4.zRotate(matrix, rotation[2])
      matrix = m4.scale(matrix, scale[0], scale[1], scale[2])

      // 设置矩阵
      gl.uniformMatrix4fv(matrixLocation, false, matrix)

      var color = [Math.random(), Math.random(), Math.random(), 1]
      // Set a random color.
      gl.uniform4fv(colorLocation, color)
      // 绘制图形
      var primitiveType = gl.TRIANGLES
      var offset = 0
      var count = 18

      gl.drawArrays(primitiveType, offset, count)
    }
    setInterval(() => {
      //   moveOrigin = [0, 0]
      //   // rotationInRadians = [Math.random() * Math.PI]
      //   // translation = [1000, gl.canvas.height / 2]
      //   // scale = [Math.random() * 2, Math.random() * 2]

      //   // translation[0] += 10
      //   // translation[1] += 10
      //   // if (translation[0] >= gl.canvas.width) {
      //   //   translation[0] = 0
      //   //   translation[1] = 0
      //   // }

      draw()
    }, 100)
  }

  onMounted(() => {
    var canvas = document.querySelector('#c')

    var gl = canvas.getContext('webgl2')

    useShader(gl)
  })
</script>
<style lang="scss" scoped></style>
