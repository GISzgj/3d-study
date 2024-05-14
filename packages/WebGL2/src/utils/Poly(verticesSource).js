/**
 * types POINTS LINE_STRIP LINE_LOOP TRIANGLES
 * elementBytes 元素字节数
 * categorySize 类目尺寸: 一个类目中所有系列尺寸的总和(一个顶点的数据个数), 类目: 可以理解为顶点
 * attributes attribute属性集合，其数据结构如下：
    {
      a_Position: {
        size: 3,
        index:0
      }
    }
    a_Position 对应attribute变量名
    size 系列尺寸
    index 系列的元素索引位置

 * @returns
 */
/**
 * 传递uniforms
 *  uniforms: {
      u_ViewMatrix: {
        type: 'uniformMatrix4fv',
        value: viewMatrix.elements
      },
    }
    u_Color 对应uniform变量名
    type uniform变量的修改方法
    value uniform变量的值
 */
/**
 * maps:{
    {
      u_Sampler:{
        image,
        format = gl.RGB,
        wrapS,
        wrapT,
        magFilter,
        minFilter
        },
    }
  }
    image 图形源
    format 数据类型，默认gl.RGB
    wrapS 对应纹理对象的TEXTURE_WRAP_S 属性
    wrapT 对应纹理对象的TEXTURE_WRAP_T 属性
    magFilter 对应纹理对象的TEXTURE_MAG_FILTER 属性
    minFilter对应纹理对象的TEXTURE_MIN_FILTER属性
 */
// 类目: 可以理解为一个顶点所有有关数据
// 系列: 一个顶点包含的数据, 例如包含position和color两种系列
const defAttr = () => ({
  gl: null,
  source: new Float32Array(),
  sourceSize: 0,
  elementBytes: 4, // arrayfloat32
  attributes: {},
  types: ['POINTS'],
  uniforms: {},
  maps: {}
})

class Poly {
  constructor(attr) {
    Object.assign(this, defAttr(), attr)
    this.init()
  }
  init() {
    if (!this.gl) return
    // 基于数据源计算类目尺寸、类目字节数、顶点总数
    this.calculateSourceSize()
    // 更新每个与顶点有关的数据
    this.updateAttribute()
    // 更新每个全局数据
    this.updateUniform()
  }

  // 基于数据源计算类目尺寸、类目字节数、顶点总数
  calculateSourceSize() {
    const { attributes, source, elementBytes } = this
    let categorySize = 0
    Object.values(attributes).forEach(attr => {
      // size: 系列尺寸; index: 系列索引
      const { size, index } = attr
      categorySize += size
      // 系列的开始Byte索引位置
      attr.byteIndex = index * elementBytes
    })
    // 类目尺寸: 顶点的尺寸
    this.categorySize = categorySize
    // 类目的字节数
    this.categoryBytes = categorySize * elementBytes
    // 顶点总数
    this.sourceSize = source.length / categorySize
  }
  updateAttribute() {
    const { gl, attributes, source, categoryBytes } = this
    // 1. 创建数据源缓冲区并绑定写入数据.
    // 2. 使用 vertexAttribPointer 获取每个系列的数据位置
    // 3. 为每个系列启动顶点数据
    const sourceBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, sourceBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, source, gl.DYNAMIC_DRAW)
    for (let [key, { size, byteIndex }] of Object.entries(attributes)) {
      // key: 系列名称
      const a = gl.getAttribLocation(gl.program, key)
      gl.vertexAttribPointer(a, size, gl.FLOAT, false, categoryBytes, byteIndex)
      gl.enableVertexAttribArray(a)
    }
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
  updateMaps() {
    const { gl, maps } = this
    Object.entries(maps).forEach(([key, val], ind) => {
      const { format = gl.RGB, image, wrapS, wrapT, magFilter, minFilter } = val

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.activeTexture(gl[`TEXTURE${ind}`])

      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)

      gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, image)

      wrapS && gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS)
      wrapT && gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT)

      magFilter && gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter)

      if (!minFilter || minFilter > 9729) {
        gl.generateMipmap(gl.TEXTURE_2D)
      }

      minFilter && gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter)

      const u = gl.getUniformLocation(gl.program, key)
      gl.uniform1i(u, ind)
    })
  }

  // 绘制
  draw(types = this.types) {
    const { gl, sourceSize } = this
    for (let type of types) {
      gl.drawArrays(gl[type], 0, sourceSize)
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
