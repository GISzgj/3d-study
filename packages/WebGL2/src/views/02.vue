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
        0, 0, 0, 0.5, 0.7, 0
      ]),
      gl.STATIC_DRAW
    )
  }
  const initProgram = async gl => {
    const shaderSource = await currentGlsl(1, vertex, fragment)
    const vertexShaderSource = shaderSource.shader
    const fragmentShaderSource = shaderSource.fragment
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)
    return program
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
  }
  onMounted(async () => {
    var canvas = document.querySelector('#c')
    var gl = canvas.getContext('webgl2')
    const program = await initProgram(gl)
    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, 'a_position')

    // look up uniform locations
    var colorLocation = gl.getUniformLocation(program, 'u_color')
    // const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
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
    setGeometry(gl)
    draw()
    function draw() {
      resizeCanvasToDisplaySize(gl.canvas)
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.useProgram(program)
      gl.bindVertexArray(vao)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      var color = [Math.random(), Math.random(), Math.random(), 1]
      gl.uniform4fv(colorLocation, color)
      // 绘制图形
      var primitiveType = gl.TRIANGLES
      var offset = 0
      var count = 3
      gl.drawArrays(primitiveType, offset, count)
    }
  })
</script>
<style lang="scss" scoped></style>
