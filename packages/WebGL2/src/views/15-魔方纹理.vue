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
  // import { Poly, CachPoly } from '@/utils/Poly.js'

  const vertex = import.meta.glob('/src/views/vertex/*.glsl')
  const fragment = import.meta.glob('/src/views/fragment/*.glsl')
  const initProgram = async gl => {
    const shaderSource = await currentGlsl(14, vertex, fragment)
    const vertexShaderSource = shaderSource.shader
    const fragmentShaderSource = shaderSource.fragment
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)
    return program
  }

  onMounted(async () => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector('#c')
    const gl = canvas.getContext('webgl2')

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
    console.log(viewMatrix)

    const u_viewMatrix = gl.getUniformLocation(program, 'u_viewMatrix')
    //设置背景色
    gl.clearColor(0, 0, 0, 0)
    // const sorceNum = createPoly(gl)
    const poly = usePoly(gl, viewMatrix)
    const mx = new Matrix4().makeRotationX(0.02)
    const my = new Matrix4().makeRotationY(0.02)
    // 连续渲染
    !(function ani() {
      viewMatrix.multiply(my).multiply(mx)
      gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix.elements)
      // render(gl, sorceNum)
      requestAnimationFrame(ani)
    })()
  })
  // 图形实例
  /**
   *
   * @param gl {WebGL2RenderingContext}
   */
  function createPoly(gl) {
    const program = gl.program
    //数据源
    const source = new Float32Array([
      -0.5,
      -0.5,
      -0.5,
      0, // 0
      0, // 0 前三个是顶点位置, 后两个是纹理图钉位置
      -0.5,
      0.5,
      -0.5,
      0, // 1
      0.5, // 1
      0.5,
      -0.5,
      -0.5,
      0.25, // 2
      0, // 2
      -0.5,
      0.5,
      -0.5,
      0,
      0.5,
      0.5,
      0.5,
      -0.5,
      0.25,
      0.5,
      0.5,
      -0.5,
      -0.5,
      0.25,
      0,

      -0.5,
      -0.5,
      0.5,
      0.25,
      0,
      0.5,
      -0.5,
      0.5,
      0.5,
      0,
      -0.5,
      0.5,
      0.5,
      0.25,
      0.5,
      -0.5,
      0.5,
      0.5,
      0.25,
      0.5,
      0.5,
      -0.5,
      0.5,
      0.5,
      0,
      0.5,
      0.5,
      0.5,
      0.5,
      0.5,

      -0.5,
      0.5,
      -0.5,
      0.5,
      0,
      -0.5,
      0.5,
      0.5,
      0.5,
      0.5,
      0.5,
      0.5,
      -0.5,
      0.75,
      0,
      -0.5,
      0.5,
      0.5,
      0.5,
      0.5,
      0.5,
      0.5,
      0.5,
      0.75,
      0.5,
      0.5,
      0.5,
      -0.5,
      0.75,
      0,

      -0.5,
      -0.5,
      -0.5,
      0,
      0.5,
      0.5,
      -0.5,
      -0.5,
      0.25,
      0.5,
      -0.5,
      -0.5,
      0.5,
      0,
      1,
      -0.5,
      -0.5,
      0.5,
      0,
      1,
      0.5,
      -0.5,
      -0.5,
      0.25,
      0.5,
      0.5,
      -0.5,
      0.5,
      0.25,
      1,

      -0.5,
      -0.5,
      -0.5,
      0.25,
      0.5,
      -0.5,
      -0.5,
      0.5,
      0.25,
      1,
      -0.5,
      0.5,
      -0.5,
      0.5,
      0.5,
      -0.5,
      -0.5,
      0.5,
      0.25,
      1,
      -0.5,
      0.5,
      0.5,
      0.5,
      1,
      -0.5,
      0.5,
      -0.5,
      0.5,
      0.5,

      0.5,
      -0.5,
      -0.5,
      0.5,
      0.5,
      0.5,
      0.5,
      -0.5,
      0.75,
      0.5,
      0.5,
      -0.5,
      0.5,
      0.5,
      1,
      0.5,
      -0.5,
      0.5,
      0.5,
      1,
      0.5,
      0.5,
      -0.5,
      0.75,
      0.5,
      0.5,
      0.5,
      0.5,
      0.75,
      1
    ])
    const ELESIZE = source.BYTES_PER_ELEMENT
    // 一个类目有5个数据, 包含两个系列
    const positionSize = 3
    const pinSize = 2
    const categorySize = positionSize + pinSize
    const categoryBytes = categorySize * ELESIZE
    // 系列初始索引位置
    const positionByteIndex = 0
    const pinByteIndex = positionByteIndex + positionSize * ELESIZE
    // 顶点个数
    const sorceNum = source.length / categorySize
    const sourceBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, sourceBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, source, gl.STATIC_DRAW)
    const a_position = gl.getAttribLocation(program, 'a_position')
    gl.vertexAttribPointer(
      a_position,
      positionSize,
      gl.FLOAT,
      false,
      // 一个顶点数据的byte位数
      categoryBytes,
      positionByteIndex
    )
    gl.enableVertexAttribArray(a_position)
    const a_pin = gl.getAttribLocation(program, 'a_pin')
    gl.vertexAttribPointer(a_pin, pinSize, gl.FLOAT, false, categoryBytes, pinByteIndex)
    gl.enableVertexAttribArray(a_pin)
    // 进行贴图
    gl.activeTexture(gl.TEXTURE0)
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    /* 图像预处理 */
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    const image = new Image()
    image.src = '/webgl-lesson/06-颜色与纹理/images/mf.jpg'
    image.onload = function () {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      const u_sampler = gl.getUniformLocation(program, 'u_sampler')
      gl.uniform1i(u_sampler, 0)
    }
    return sorceNum
  }
  function usePoly(gl, viewMatrix) {
    const source = new Float32Array([
      -0.5, 0.5, 0, 1, -0.5, -0.5, 0, 0.0, 0.5, 0.5, 1.0, 1, 0.5, -0.5, 1.0, 0.0
    ])

    const rect = new Poly({
      gl,
      source,
      types: ['TRIANGLE_STRIP'],
      attributes: {
        a_position: {
          size: 2,
          index: 0
        },
        a_pin: {
          size: 2,
          index: 2
        }
      },
      uniforms: {
        u_viewMatrix: {
          type: 'uniformMatrix4fv',
          value: viewMatrix.elements
        }
      }
    })

    const image = new Image()
    image.src = '/webgl-lesson/06-颜色与纹理/images/erha.jpg'
    image.onload = function () {
      rect.maps = {
        u_Sampler: { image }
      }
      rect.updateMaps()
      rect.draw()
    }
    return rect
  }
</script>
<style lang="scss" scoped></style>
