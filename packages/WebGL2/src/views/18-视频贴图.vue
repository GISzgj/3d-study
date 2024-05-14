<template>
  <div>
    <canvas id="c" style="width: 100%; height: 100%; background-color: brown"></canvas>
  </div>
</template>
<script setup>
  import { onMounted, ref } from 'vue'
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
  const vertex = import.meta.glob('/src/views/vertex/*.glsl')
  const fragment = import.meta.glob('/src/views/fragment/*.glsl')
  const initProgram = async gl => {
    const shaderSource = await currentGlsl(17, vertex, fragment)
    const vertexShaderSource = shaderSource.shader
    const fragmentShaderSource = shaderSource.fragment
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)
    return program
  }
  let gl, rect
  onMounted(async () => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector('#c')
    gl = canvas.getContext('webgl2')
    // 开启深度测试
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    resizeCanvasToDisplaySize(gl.canvas)
    const program = await initProgram(gl)
    gl.program = program
    gl.useProgram(program)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    // 视图矩阵
    const viewMatrix = new Matrix4()
    viewMatrix.lookAt(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 1, 0))
    const u_viewMatrix = gl.getUniformLocation(program, 'u_viewMatrix')
    //设置背景色
    gl.clearColor(0, 0, 0, 0)
    crtRect(gl)
  })
  let video
  /**
   * @param gl {WebGL2RenderingContext}
   */
  function crtRect(gl) {
    const source = new Float32Array([
      -0.5, 0.4, 0, 1, -0.5, -0.4, 0, 0.0, 0.5, 0.4, 1.0, 1, 0.5, -0.4, 1.0, 0.0
    ])
    const ELEMENTSBYTES = source.BYTES_PER_ELEMENT
    const sourceBUffer = gl.createBuffer()
    const positionSize = 2
    const pinSize = 2
    const categorySize = positionSize + pinSize
    const categoryByte = categorySize * ELEMENTSBYTES
    const positionByteIndex = 0
    const pinByteIndex = positionByteIndex + positionSize * ELEMENTSBYTES
    gl.bindBuffer(gl.ARRAY_BUFFER, sourceBUffer)
    gl.bufferData(gl.ARRAY_BUFFER, source, gl.STATIC_DRAW)
    const a_position = gl.getAttribLocation(gl.program, 'a_position')
    gl.vertexAttribPointer(
      a_position,
      positionSize,
      gl.FLOAT,
      false,
      categoryByte,
      positionByteIndex
    )
    gl.enableVertexAttribArray(a_position)
    const a_pin = gl.getAttribLocation(gl.program, 'a_pin')
    gl.vertexAttribPointer(a_pin, pinSize, gl.FLOAT, false, categoryByte, pinByteIndex)
    gl.enableVertexAttribArray(a_pin)

    // 视频贴图
    gl.activeTexture(gl.TEXTURE0)
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    const u_sampler = gl.getUniformLocation(gl.program, 'u_sampler')
    gl.uniform1i(u_sampler, 0)
    video = document.createElement('video')
    video.src = 'http://img.yxyy.name/ripples.mp4'
    video.autoplay = true
    video.muted = true
    video.loop = true
    video.setAttribute('crossOrigin', 'Anonymous')
    video.play()
    video.addEventListener('playing', () => {
      render()
    })
  }
  /**
   * @param gl {WebGL2RenderingContext}
   */
  function render() {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video)
    gl.clearColor(0, 0, 0, 0)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    requestAnimationFrame(render)
  }
  /**
   * @param {HTMLImageElement} img
   */
  function imgPromise(img) {
    return new Promise((resolve, reject) => {
      img.onload = () => {
        resolve(img)
      }
    })
  }
</script>
<style lang="scss" scoped></style>
