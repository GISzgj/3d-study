<template>
  <div style="overflow: hidden">
    <canvas id="c" style="width: 100vw; height: 100vh; background-color: brown"></canvas>
  </div>
</template>
<script setup>
  import { onMounted, ref } from 'vue'
  import gsap from 'gsap'
  import { Matrix3, Matrix4, Vector3, Color, Euler, Quaternion } from 'three'
  import {
    currentGlsl,
    createShader,
    createProgram,
    resizeCanvasToDisplaySize
  } from '@/libs/utils.js'
  import { Poly } from '@/utils/Poly(verticesSource).js'
  const vertex = import.meta.glob('/src/views/vertex/*.glsl')
  const fragment = import.meta.glob('/src/views/fragment/*.glsl')
  const webGL = import.meta.glob('/src/views/*.vue')
  const initProgram = async gl => {
    const length = Object.values(webGL).length
    const shaderSource = await currentGlsl(length - 1, vertex, fragment)
    const vertexShaderSource = shaderSource.shader
    const fragmentShaderSource = shaderSource.fragment
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)
    return program
  }
  let gl
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
    //设置背景色
    gl.clearColor(0, 0, 0, 0)
    olaRotate()
  })
  // 欧拉角旋转
  //   已知：世界坐标系m1;点P 在世界坐标系内;点P 的世界坐标位P1(x,y,z)
  //   求：点P绕世界坐标系的x轴逆时针旋转angX度，绕本地坐标系的y轴逆时针旋转angY度，绕本地坐标系的z轴逆时针旋转angZ度后的世界位P2。
  // 解: 右乘  p2 = mz*my*mx*p1
  function olaRotate() {
    // p1在世界坐标系内的位置
    const p1 = new Vector3(1, 1, 1)
    // 旋转的角度
    const [angX, angY, angZ] = [1, 2, 3]
    // 一. 矩阵乘法 建立旋转矩阵
    const mx = new Matrix4().makeRotationX(angX)
    const my = new Matrix4().makeRotationY(angY)
    const mz = new Matrix4().makeRotationZ(angZ)
    // 计算旋转后的点p2
    const rp2 = p1.clone().applyMatrix4(mx.multiply(my).multiply(mz))
    console.log(rp2)
    // 二. 欧拉旋转
    const euler = new Euler(angX, angY, angZ, 'XYZ')
    const op2 = p1.clone().applyEuler(euler)
    console.log(op2)
    // 欧拉旋转
    const m = new Matrix4().makeRotationFromEuler(euler)
    const rop2 = p1.clone().applyMatrix4(m)
    console.log(rop2)
  }

  // 四元数旋转 的实现原理：

  // 将旋转轴带着顶点一起旋转，让旋转轴与xyz中的某一个轴同向，比如z轴。
  // 让顶点绕z轴旋转相应的度数。
  // 让顶点按照之前旋转轴的旋转量逆向转回去。
  const quaternion = new Quaternion()
  quaternion.setFromAxisAngle(OC2, ang)
  const m = new Matrix4()
  m.makeRotationFromQuaternion(quaternion)
  console.log(P1.clone().applyMatrix4(m))
</script>
<style lang="scss" scoped></style>
