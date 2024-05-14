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
    const shaderSource = await currentGlsl(16, vertex, fragment)
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
  /**
   * @param gl {WebGL2RenderingContext}
   */
  function crtRect(gl) {
    let n = 0
    let len = 5
    const obj = { ratio: 0 }
    const source = new Float32Array([
      -0.4, 0.8, 0, 1, -0.4, -0.8, 0, 0, 0.4, 0.8, 1, 1, 0.4, -0.8, 1, 0
    ])
    rect = new Poly({
      gl,
      source,
      types: ['TRIANGLE_STRIP'],
      uniforms: {
        u_ratio: {
          type: 'uniform1fv',
          value: [0]
        }
      },
      attributes: {
        a_position: {
          size: 2,
          index: 0
        },
        a_pin: {
          size: 2,
          index: 2
        }
      }
    })
    function crtImgs() {
      const originImg = new Image()
      originImg.src = `/webgl-lesson/06-颜色与纹理/images/dress.jpg`

      const mask = new Image()
      mask.src = `/webgl-lesson/06-颜色与纹理/images/mask-dress.jpg`
      Promise.all([imgPromise(originImg), imgPromise(mask)]).then(res => {
        rect.maps = {
          u_sampler: { image: originImg },
          u_mask: { image: mask }
        }
        rect.updateMaps()
        rect.draw()
        loadImg()
      })
    }
    function loadImg() {
      n++
      const i1 = n % len
      const i2 = (n + 1) % len
      const pattern1 = new Image()
      pattern1.src = `/webgl-lesson/06-颜色与纹理/images/pattern${i1}.jpg`
      const pattern2 = new Image()
      pattern2.src = `/webgl-lesson/06-颜色与纹理/images/pattern${i2}.jpg`
      Promise.all([imgPromise(pattern1), imgPromise(pattern2)]).then(res => {
        changeImg(pattern1, pattern2)
        ani()
      })
    }
    const changeImg = (...imgs) => {
      obj.ratio = 0
      rect.maps.u_pattern1 = { image: imgs[0] }
      rect.maps.u_pattern2 = { image: imgs[1] }
      rect.updateMaps()
      gsap.to(obj, {
        ratio: 1,
        duration: 0.7,
        onComplete: () => {
          loadImg()
        }
      })
    }
    /* 动画 */
    function ani() {
      rect.uniforms.u_ratio.value = [obj.ratio]
      rect.updateUniform()
      render()
      requestAnimationFrame(ani)
    }
    crtImgs()
  }

  //渲染
  function render() {
    gl.clearColor(0, 0, 0, 0)
    rect.draw()
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
