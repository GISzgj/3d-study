<template>
  <div>
    <canvas id="c" style="width: 1800px; height: 900px; background-color: brown"></canvas>
  </div>
</template>
<script setup>
  import { onMounted, ref } from 'vue'
  import gsap from 'gsap'
  import { Matrix3, Matrix4 } from 'three'
  import {
    currentGlsl,
    createShader,
    createProgram,
    resizeCanvasToDisplaySize
  } from '@/libs/utils.js'
  import { Quadtree, Rectangle } from '@/utils/Quadtree.js'
  import { Poly, CachPoly } from '@/utils/Poly.js'
  const vertex = import.meta.glob('/src/views/vertex/*.glsl')
  const fragment = import.meta.glob('/src/views/fragment/*.glsl')
  const initProgram = async gl => {
    const shaderSource = await currentGlsl(6, vertex, fragment)
    const vertexShaderSource = shaderSource.shader
    const fragmentShaderSource = shaderSource.fragment
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)
    return program
  }
  // poly: 当前绘制的图形
  let poly
  // 缓存所有绘制的图形
  let cachPoly
  // 四叉树, 记录所有图形的点信息,建立四叉树模型
  let quadtree
  // 鼠标移动点建立的矩形
  let movePointRec
  // 鼠标移动到图形上的点
  let mousePoint
  // 闪烁动画
  let tiemLine = []
  onMounted(async () => {
    const canvas = document.querySelector('#c')
    const gl = canvas.getContext('webgl2')
    // 开启混合能力
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    resizeCanvasToDisplaySize(gl.canvas)
    const rectangle = new Rectangle(0, 0, canvas.width, canvas.height)
    quadtree = new Quadtree(rectangle, 5)
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
    // 列主序的矩阵(数学上一般是行主序); 使用set方法穿的参数是行主序
    const m3 = new Matrix3()
    m3.makeScale(1 / gl.canvas.width, 1 / gl.canvas.height)
    m3.scale(2, 2)
    m3.translate(-1, -1)
    m3.scale(1, -1)
    console.log(m3)
    gl.uniformMatrix3fv(matrixLocation, false, m3.elements)

    // const matrixs1 = new m3.scaling(1 / gl.canvas.width, 1 / gl.canvas.height)
    // const matrixs2 = new m3.scaling(2, 2)
    // const matrixt1 = new m3.translation(-1, -1)
    // const matrixs3 = new m3.scaling(1, -1)
    // let matrix = m3.multiply(matrixs2, matrixs1)
    // matrix = m3.multiply(matrixt1, matrix)
    // matrix = m3.multiply(matrixs3, matrix)
    // gl.uniformMatrix3fv(matrixLocation, false, matrix)
    // --------------------------顶点绘制--------------------------------------------
    cachPoly = new CachPoly(gl)

    // 异步绘制图形
    canvas.addEventListener('mousedown', e => {
      if (e.button === 2) {
        poly && popVertice()
      } else {
        const x = e.pageX - canvas.offsetLeft
        const y = e.pageY - canvas.offsetTop
        if (poly) {
          addOneVertice(x, y, gl)
          for (let i = 1; i <= 15; i++) {
            addOneVertice(Math.random() * canvas.width, Math.random() * canvas.height, gl)
          }
        } else {
          createPolygon(x, y, gl)
        }
      }
      quadtree.clear()
      for (let { geoData } of cachPoly.polygons) {
        for (let pointObj of geoData) {
          quadtree.insert(pointObj)
        }
      }
      console.log(tiemLine)

      render(gl)
    })
    canvas.oncontextmenu = function () {
      return false
    }
    canvas.addEventListener('mousemove', e => {
      const x = e.pageX - canvas.offsetLeft
      const y = e.pageY - canvas.offsetTop
      movePointRec = new Rectangle(x - 50, y - 50, 100, 100)
      const points = quadtree.query(movePointRec, [])
      mousePoint = hoverPointofQuadtree(x, y, points)
      // mousePoint = hoverPoint(x, y)
      if (mousePoint) {
        canvas.style.cursor = 'pointer'
      } else {
        canvas.style.cursor = 'default'
      }
      if (poly) {
        const obj = poly.geoData[poly.geoData.length - 1]
        obj.x = x
        obj.y = y
        render(gl)
      }
    })
    // 使用requestAnimationFrame进行渲染
    !(function ani() {
      render(gl)
      requestAnimationFrame(ani)
    })()
    ;() => {}
  })

  function addOneVertice(x, y, gl) {
    const { geoData } = poly
    if (mousePoint) {
      geoData[geoData.length - 1] = mousePoint
    }
    let obj = { x, y, pointSize: Math.random() * 10 + 5, alpha: 1.0 }
    ficker(obj, gl)
    geoData.push(obj)
  }
  function popVertice() {
    let timer = tiemLine.pop()
    timer.kill()
    timer = null
    poly.geoData.pop()
    poly = null
  }
  function createPolygon(x, y, gl) {
    const point1 = mousePoint ? mousePoint : { x, y, pointSize: Math.random() * 10 + 5, alpha: 1.0 }
    const point2 = { x, y, pointSize: Math.random() * 10 + 5, alpha: 1.0 }
    // 当前绘制的多边形
    poly = new Poly({
      gl: gl,
      geoData: [point1, point2],
      types: ['POINTS', 'LINE_STRIP'],
      size: 4
    })
    cachPoly.addPolygon(poly)
    ficker(point1, gl)
    setTimeout(() => {
      ficker(point2, gl)
    }, Math.random() * 1000)
  }

  function ficker(obj, gl) {
    tiemLine.push(
      gsap.to(obj, {
        alpha: 0.2,
        duration: 1,
        yoyo: true,
        repeat: -1
      })
    )
  }
  function render(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT)
    cachPoly.updateVertices(['x', 'y', 'pointSize', 'alpha'])
    cachPoly.draw()
  }
  function hoverPointofQuadtree(mx, my, points) {
    for (let point of points) {
      if (poly && poly.geoData[poly.geoData.length - 1] === point) {
        continue
      }
      let x = mx - point.x
      let y = my - point.y
      // 鼠标位置和缓存点位的距离的平方
      const dist = x * x + y * y
      if (dist < 100) {
        return point
      }
    }
    return null
  }
  function hoverPoint(mx, my) {
    // mx my 鼠标坐标
    for (let { geoData } of cachPoly.polygons) {
      // obj是缓存的多边形的顶点数据组
      for (let obj of geoData) {
        if (poly && obj === poly.geoData[poly.geoData.length - 1]) {
          // 判断当前的顶点是否是当前绘制的多边形的最后一个顶点; 如果是跳过;若不是计算距离
          continue
        }
        let x = mx - obj.x
        let y = my - obj.y
        // 鼠标位置和缓存点位的距离的平方
        const dist = x * x + y * y

        if (dist < 100) {
          return obj
        }
      }
    }
    return null
  }
</script>
<style lang="scss" scoped></style>
