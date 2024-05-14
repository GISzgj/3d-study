const currentGlsl = (index = 0, vertex, fragment) => {
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
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }
  gl.deleteShader(shader)
}
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }
  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
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
export { currentGlsl, createShader, createProgram, resizeCanvasToDisplaySize }
