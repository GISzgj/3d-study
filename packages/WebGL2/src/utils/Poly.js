const defAttr = () => ({
  gl: null,
  vertices: [],
  geoData: [],
  size: 3,
  attrName: 'a_position',
  count: 0,
  types: ['POINTS'],
  uniforms: {}
})
/**
 * 传递uniforms
 *  uniforms: {
      u_ViewMatrix: {
        type: 'uniformMatrix4fv',
        value: viewMatrix.elements
      },
    }
 */
class Poly {
  constructor(attr) {
    Object.assign(this, defAttr(), attr)
    this.init()
  }
  init() {
    const { gl, size, attrName } = this
    if (!gl) return
    // 创建顶点缓冲区
    const vertexBuffer = gl.createBuffer()
    // 绑定gl的上下文缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    // 更新缓冲区数据
    this.updateBuffer()
    // 获取shader的变量位置
    const a_position = gl.getAttribLocation(gl.program, attrName)
    gl.vertexAttribPointer(a_position, size, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_position)
    // 更新uniform变量
    this.updateUniform()
  }
  updateUniform() {
    const { gl, uniforms } = this
    for (let [key, val] of Object.entries(uniforms)) {
      const { type, value } = val
      const u = gl.getUniformLocation(gl.program, key)
      if (type.includes('Matrix')) {
        // u: 数据地址; false: 不进行转置; value: 传递给u的数据
        gl[type](u, false, value)
      } else {
        gl[type](u, value)
      }
    }
  }
  /**
   * 添加顶点
   * @param  {...any} params
   * @example 10, 200
   * x: 10, y: 200像素位置
   */
  addVertice(...params) {
    this.vertices.push(...params)
    this.updateBuffer()
  }
  popVertice() {
    const { vertices, size } = this
    const len = vertices.length
    // 删除最后两个数
    vertices.splice(len - size, len)
    // this.updateBuffer()
    this.updateCount()
  }
  setVertice(ind, ...params) {
    // ind 要设置数据的索引(第几个绘图单位,从0开始)
    // params 要设置的数据
    const { vertices, size } = this
    const i = ind * size
    params.forEach((param, paramInd) => {
      vertices[i + paramInd] = param
    })
  }

  updateBuffer() {
    const { gl, vertices } = this
    this.updateCount()
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  }
  updateCount() {
    this.count = this.vertices.length / this.size
  }
  updateVertices(params) {
    // params: ['x','y','pointSize','alpha']
    // geoData是一个数组，包含多个对象，每个对象对应一个绘图单位; 需要在初始化时进行绑定
    const { geoData } = this
    const vertices = []
    geoData.forEach(data => {
      params.forEach(key => {
        vertices.push(data[key])
      })
    })
    this.vertices = vertices
  }
  draw(types = this.types) {
    const { gl, count } = this
    for (let type of types) {
      gl.drawArrays(gl[type], 0, count)
    }
  }
}

// 缓存多个多边形
class CachPoly {
  constructor(gl) {
    this.gl = gl
    this.polygons = []
  }
  addPolygon(polygon) {
    // polygon 是poly对象
    if (!(polygon instanceof Poly)) {
      return console.error('polygon must be instanceof Poly')
    }
    this.polygons.push(polygon)
  }
  updateVertices(params) {
    // params: ['x','y','pointSize','alpha']是geoData中的属性名
    this.polygons.forEach(polygon => {
      polygon.updateVertices(params)
    })
  }
  draw() {
    const { polygons } = this
    for (let polygon of polygons) {
      polygon.init()
      polygon.draw()
    }
  }
}
export { Poly, CachPoly }
