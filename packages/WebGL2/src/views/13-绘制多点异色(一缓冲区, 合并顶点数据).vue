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
  // import { Poly, CachPoly } from '@/utils/Poly.js'
  import { Poly } from '@/utils/Poly(verticesSource).js'
  const vertex = import.meta.glob('/src/views/vertex/*.glsl')
  const fragment = import.meta.glob('/src/views/fragment/*.glsl')
  const initProgram = async gl => {
    const shaderSource = await currentGlsl(12, vertex, fragment)
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
    // 开启混合能力
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    resizeCanvasToDisplaySize(gl.canvas)
    const program = await initProgram(gl)
    gl.program = program
    gl.useProgram(program)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    //设置背景色
    // gl.clearColor(0, 0, 0, 0)
    // create(gl)
    createPoly(gl)
  })
  // 图形实例(不使用poly)
  function create(gl) {
    const program = gl.program
    // 设置视图矩阵
    const viewMatrix = new Matrix4().lookAt(
      new Vector3(0.0, 0.0, 0.0),
      new Vector3(),
      new Vector3(0, 1, 0)
    )
    const u_viewMatrix = gl.getUniformLocation(program, 'u_viewMatrix')
    gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix.elements)
    // 设置模型矩阵
    const modelMatrix = new Matrix4()
    const u_modelMatrix = gl.getUniformLocation(program, 'u_modelMatrix')
    gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.elements)
    // 类目：一个顶点对应一个类目，也就是上面source中的每一行
    // 系列：一个类目中所包含的每一种数据，比如顶点位置数据、顶点颜色数据
    // 据源：整个合而为一的数据source
    const source = new Float32Array([
      0.1,
      0.2,
      1.0,
      1,
      0,
      0,
      1, // 7 个代表一个顶点数据
      -0.2,
      -0.2,
      1.0,
      0,
      1,
      0,
      1, // 7 个代表一个顶点数据
      0.4,
      -0.2,
      1.0,
      0,
      0,
      1,
      1 // 7 个代表一个顶点数据
    ])
    // 元素字节数(32位浮点集合中每个元素的字节数)
    const elementBytes = source.BYTES_PER_ELEMENT
    console.log(elementBytes)

    // 系列尺寸(一个系列中每个向量的分量个数), 有两个系列顶点和颜色
    // 顶点系列中每个向量的分量个数
    const verticeSize = 3
    // 颜色系列中每个向量的分量个数
    const colorSize = 4
    // 类目尺寸: 一个类目中所有系列尺寸的总和
    const categorySize = verticeSize + colorSize
    //类目字节数: 一个类目中所有系列字节数的总和
    const categoryBytes = categorySize * elementBytes
    // 顶点系列在source中的字节起始位置
    const verticeByteIndex = 0
    // 颜色系列在source中的字节起始位置
    const colorByteIndex = verticeByteIndex + verticeSize * elementBytes
    // 顶点总数: 类目的个数
    const vertexCount = source.length / categorySize
    // 使用vertexAttribPointer() 寻找系列数据
    // 绑定数据源缓冲区(一个缓冲区)
    const sourceBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, sourceBuffer)
    // 向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, source, gl.STATIC_DRAW)
    // 寻找系列数据
    const a_position = gl.getAttribLocation(program, 'a_position')
    // 1: 数据位置. 2: 顶点系列的尺寸. 3: 数据类型. 4: 是否归一化. 5: 步长(byte为最小单位). 6: 偏移量(系列byte起始位置)
    gl.vertexAttribPointer(
      a_position,
      verticeSize,
      gl.FLOAT,
      false,
      categoryBytes,
      verticeByteIndex
    )
    gl.enableVertexAttribArray(a_position)
    const a_color = gl.getAttribLocation(program, 'a_color')
    gl.bindBuffer(gl.ARRAY_BUFFER, sourceBuffer)
    gl.vertexAttribPointer(a_color, colorSize, gl.FLOAT, false, categoryBytes, colorByteIndex)
    gl.enableVertexAttribArray(a_color)
    // 绘制
    gl.clearColor(0, 0, 0, 1)
    gl.drawArrays(gl.POINTS, 0, vertexCount)
    return
  }
  function createPoly(gl) {
    const viewMatrix = new Matrix4().lookAt(
      new Vector3(0.0, 0.0, 0.0),
      new Vector3(),
      new Vector3(0, 1, 0)
    )
    // 设置模型矩阵
    const modelMatrix = new Matrix4()
    const source = new Float32Array([
      0.1,
      0.2,
      1.0,
      1,
      0,
      0,
      1, // 7 个代表一个顶点数据
      -0.2,
      -0.2,
      1.0,
      0,
      1,
      0,
      1, // 7 个代表一个顶点数据
      0.4,
      -0.2,
      1.0,
      0,
      0,
      1,
      1 // 7 个代表一个顶点数据
    ])
    const poly = new Poly({
      gl,
      source,
      attributes: {
        a_position: { size: 3, index: 0 },
        a_color: { size: 4, index: 3 }
      },
      elementBytes: source.BYTES_PER_ELEMENT,
      uniforms: {
        u_viewMatrix: {
          type: 'uniformMatrix4fv',
          value: viewMatrix.elements
        },
        u_modelMatrix: {
          type: 'uniformMatrix4fv',
          value: modelMatrix.elements
        }
      }
    })
    poly.draw()
    return poly
  }
</script>
<style lang="scss" scoped></style>
