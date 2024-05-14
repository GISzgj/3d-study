<template>
  <title>纹理合成</title>
  <p>1. 正片叠底；p*o 对片元做分量相乘的运算，这种算法会让原始图片的亮度变暗</p>
  <p>
    2. 纹理混合(mix): 纹理混合就是按照一定比例，将第一张图像合到另一张图像上，这类似于ps
    里的透明度合成。mix(m,n,a)=m+(n-m)*a
  </p>
  <p>3. 转场动画(利用mix实现): 转场动画就是场景的淡入、淡出。</p>
  <p>
    4. 花样转场(利用mix实现):
    蒙版中的片元数据是一种插值，并不是一种具备特定功能的数据,建立一个蒙版图像，用作图案淡入的辅助数据
  </p>

  <select name="纹理混合" style="float: right" @change="handleChange">
    <option value="1">正片叠底</option>
    <option value="2">纹理混合</option>
    <option value="3">转场动画</option>
    <option value="4">转场(蒙版)动画</option>
  </select>
  <div>
    <canvas id="c" style="width: 100%; height: 100%; background-color: brown"></canvas>
  </div>
</template>
<script setup>
  import { onMounted, ref, render } from 'vue'
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
    const shaderSource = await currentGlsl(15, vertex, fragment)
    const vertexShaderSource = shaderSource.shader
    const fragmentShaderSource = shaderSource.fragment
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)
    return program
  }
  let rect = null
  let gl = null
  let is3finish
  let is4finish
  const handleChange = e => {
    if (is3finish) {
      is3finish()
    }
    if (rect) {
      const type = Number(e.target.value)
      rect.uniforms.u_synType.value = [type]
      rect.updateUniform()
      gl.clearColor(0, 0, 0, 0)
      rect.draw()
      if (type === 3) {
        is3finish = finishAnim()
      } else if (type === 4) {
        is4finish = finishFlowerAime()
      }
    }
  }
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
    rect = usePoly(gl, viewMatrix)
    crtImgs(rect)
  })
  // 图形实例
  /**
   * @param gl {WebGL2RenderingContext}
   */
  function usePoly(gl, viewMatrix) {
    const source = new Float32Array([
      -0.4, 0.8, 0, 1, -0.4, -0.8, 0, 0, 0.4, 0.8, 1.0, 1, 0.4, -0.8, 1.0, 0
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
        },
        u_synType: {
          type: 'uniform1iv',
          value: [1]
        },
        u_ratio: {
          type: 'uniform1fv',
          value: [0]
        }
      }
    })
    return rect
  }

  const crtImgs = rect => {
    const originImg = new Image()
    const pattern = new Image()
    originImg.src = '/webgl-lesson/06-颜色与纹理/images/dress.jpg'
    pattern.src = '/webgl-lesson/06-颜色与纹理/images/pattern1.jpg'
    Promise.all([imgPromise(originImg), imgPromise(pattern)]).then(res => {
      rect.maps = {
        u_sampler: { image: originImg },
        u_pattern: { image: pattern }
      }
      rect.updateMaps()
      rect.draw()
    })
  }

  // 实现转场动画
  function finishAnim() {
    let n = 0
    let len = 5
    const obj = { ratio: 0 }
    let finish = false
    const loadImgs = () => {
      n++
      const i1 = n % len
      const i2 = (n + 1) % len
      const originImg = new Image()
      originImg.src = `/webgl-lesson/06-颜色与纹理/images/pattern${i1}.jpg`
      const pattern = new Image()
      pattern.src = `/webgl-lesson/06-颜色与纹理/images/pattern${i2}.jpg`
      Promise.all([imgPromise(originImg), imgPromise(pattern)]).then(() => {
        changeImg(originImg, pattern)
        ani()
      })
    }
    const ani = () => {
      rect.uniforms.u_ratio.value = [obj.ratio]
      rect.updateUniform()
      gl.clearColor(0.0, 0.0, 0.0, 0)
      rect.draw()
      requestAnimationFrame(ani)
    }
    const changeImg = (...imgs) => {
      obj.ratio = 0
      rect.maps = {
        u_sampler: { image: imgs[0] },
        u_pattern: { image: imgs[1] }
      }
      rect.updateMaps()
      if (finish) return
      gsap.to(obj, {
        ratio: 1,
        duration: 1.5,
        onComplete() {
          loadImgs()
        }
      })
    }

    loadImgs()
    return () => (finish = true)
  }
  // 使用蒙版实现花式转场
  function finishFlowerAime() {
    let n = 0
    let len = 5
    const obj = { ratio: 0 }
    let finish = false
    const loadImgs = () => {
      n++
      const i1 = n % len
      const i2 = (n + 1) % len
      const i3 = Math.round(Math.random() * 4)
      console.log('i3', i3)
      const originImg = new Image()
      originImg.src = `/webgl-lesson/06-颜色与纹理/images/pattern${i1}.jpg`
      const pattern = new Image()
      pattern.src = `/webgl-lesson/06-颜色与纹理/images/pattern${i2}.jpg`
      const gradient = new Image()
      gradient.src = `/webgl-lesson/06-颜色与纹理/images/mask${i3}.jpg`
      Promise.all([imgPromise(originImg), imgPromise(pattern), imgPromise(gradient)]).then(imgs => {
        changeImg(originImg, pattern, gradient)
        ani()
      })
    }
    const ani = () => {
      rect.uniforms.u_ratio.value = [obj.ratio]
      rect.updateUniform()
      gl.clearColor(0.0, 0.0, 0.0, 0)
      rect.draw()
      requestAnimationFrame(ani)
    }
    const changeImg = (...imgs) => {
      obj.ratio = 0
      rect.maps = {
        u_sampler: { image: imgs[0] },
        u_pattern: { image: imgs[1] },
        u_mask: { image: imgs[2] }
      }
      rect.updateMaps()
      gsap.to(obj, {
        ratio: 1,
        duration: 2,
        onComplete() {
          loadImgs()
        }
      })
    }
    loadImgs()
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
