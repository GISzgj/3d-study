<template>
  <div>
    <canvas id="c" style="width: 1800px; height: 900px; background: #fff"></canvas>
    <div style="float: right; margin-right: 50px; width: 300px">
      <div style="cursor: pointer" @click="handleRotate">+</div>
      <span>{{ rotateGl }}</span>
    </div>
  </div>
</template>
<script setup>
  import { defineAsyncComponent, onMounted, ref } from 'vue'
  import * as cuonMatrix from 'cuon-matrix'
  let rotateGl = ref(0)

  const vertex = import.meta.glob('/src/views/vertex/*.glsl')
  const fragment = import.meta.glob('/src/views/fragment/*.glsl')
  const currentGlsl = (index = 0) => {
    const currentGlslPath = Object.keys(vertex)[index] + '?raw'
    const fragmentGlslPath = Object.keys(fragment)[index] + '?raw'
    const executeShader = () => import(/* @vite-ignore */ currentGlslPath)
    const executeFragment = () => import(/* @vite-ignore */ fragmentGlslPath)

    return new Promise(async (resolve, reject) => {
      const shader = await executeShader()
      const fragment = await executeFragment()
      resolve({
        shader: shader.default,
        fragment: fragment.default
      })
    })
  }

  function createShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) {
      return shader
    }
    gl.deleteShader(shader)
  }
  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    var success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) {
      return program
    }
    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
  }
  function setRectangle(gl, x, y, width, height) {
    var x1 = x
    var x2 = x + width
    var y1 = y
    var y2 = y + height
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
      gl.STATIC_DRAW
    )
  }
  // 在当前 ARRAY_BUFFER 缓冲存储构成 'F' 的值
  function setGeometry(gl) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // 左竖
        0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

        // 上横
        30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

        // 中横
        30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90
      ]),
      gl.STATIC_DRAW
    )
  }
  async function useShader(gl) {
    const shaderSource = await currentGlsl()
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
    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation)
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    var size = 2 // 2 components per iteration
    var type = gl.FLOAT // the data is 32bit floats
    var normalize = false // don't normalize the data
    var stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0 // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

    var colorLocation = gl.getUniformLocation(program, 'u_color')
    var translation = [850, 400]
    var rotationInRadians = 0
    var scale = [1, 1]
    let moveOrigin = [-50, -75]
    const projection = (width, height) => {
      // 注意：这个矩阵翻转了 Y 轴，所以 0 在上方
      return [2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1]
    }
    // setRectangle(gl, translation[0], translation[1], width, height)
    setGeometry(gl)
    draw()
    function draw() {
      resizeCanvasToDisplaySize(gl.canvas)
      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      // Clear the canvas
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      // Tell it to use our program (pair of shaders)
      gl.useProgram(program)
      // Bind the attribute/buffer set we want.
      gl.bindVertexArray(vao)
      // Pass in the canvas resolution so we can convert from

      // Update the position buffer with rectangle positions
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      // pixels to clipspace in the shader
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)
      // Compute the matrices
      var moveOriginMatrix = m3.translation(moveOrigin[0], moveOrigin[1])
      var translationMatrix = m3.translation(translation[0], translation[1])
      var rotationMatrix = m3.rotation(rotateGl.value)
      var scaleMatrix = m3.scaling(scale[0], scale[1])
      var projectionMatrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight)

      // Multiply the matrices.
      var matrix = m3.multiply(translationMatrix, scaleMatrix)

      matrix = m3.multiply(matrix, rotationMatrix)
      // 再旋转后平移， 效果为修改旋转中心
      matrix = m3.multiply(matrix, moveOriginMatrix)
      // 切换坐标系
      matrix = m3.multiply(projectionMatrix, matrix)
      gl.uniformMatrix3fv(matrixLocation, false, matrix)

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
  const handleRotate = () => {
    rotateGl.value += Math.PI / 6
    // draw()
  }
  onMounted(() => {
    var canvas = document.querySelector('#c')
    var gl = canvas.getContext('webgl2')
    useShader(gl)
  })
</script>
<style lang="scss" scoped></style>
