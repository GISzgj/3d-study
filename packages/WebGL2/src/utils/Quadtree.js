class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}
class Rectangle {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
  // 判断点是否在这个矩形内部
  contains(point) {
    const isInsideX = point.x >= this.x && point.x <= this.x + this.width
    const isInsideY = point.y >= this.y && point.y <= this.y + this.height

    return isInsideX && isInsideY
  }
  // 判断与另一个矩形是否相交
  intersects(rect) {
    const isIntersectsX = rect.x > this.x + this.width || rect.x + rect.width < this.x
    const isIntersectsY = rect.y > this.y + this.height || rect.y + rect.height < this.y
    return !(isIntersectsX || isIntersectsY)
  }
}

class Quadtree {
  constructor(boundary, capacity) {
    // 表示当前四叉树节点所代表的区域边界，是一个矩形对象。
    this.boundary = boundary
    // 表示每个节点最多可以容纳的点的数量。
    this.capacity = capacity
    // 数组用于存储节点内的点。
    this.points = []
    // 标志 表示当前节点是否已经分割成四个子节点。
    this.divided = false
  }
  // 用于将当前节点分割成四个子节点。
  // 首先，计算当前节点边界的四分之一大小，并创建四个新的矩形来表示子节点的边界。
  // 然后，分别创建四个新的 Quadtree 对象来代表四个子节点，并将它们存储在当前节点的属性中。
  // 最后，将当前节点的 divided 标志设置为 true，表示已经进行了分割。
  subdivide() {
    let x = this.boundary.x
    let y = this.boundary.y
    let w = this.boundary.width / 2
    let h = this.boundary.height / 2

    let ne = new Rectangle(x + w, y, w, h)
    let nw = new Rectangle(x, y, w, h)
    let se = new Rectangle(x, y + h, w, h)
    let sw = new Rectangle(x + w, y + h, w, h)

    this.northeast = new Quadtree(ne, this.capacity)
    this.northwest = new Quadtree(nw, this.capacity)
    this.southeast = new Quadtree(se, this.capacity)
    this.southwest = new Quadtree(sw, this.capacity)

    this.divided = true
  }
  // 用于向四叉树中插入一个点。
  /**
   * 1. 检查点是否在当前节点的边界内，如果不在，则直接返回 false。
   * 2. 如果当前节点的点数未超过容量限制，则将点添加到当前节点的 points 数组中，并返回 true。
   * 3. 如果当前节点已经分割成四个子节点，递归地尝试将点插入到子节点中，直到成功插入为止。
   */
  insert(point) {
    if (!this.boundary.contains(point)) {
      return false
    }
    if (this.points.length < this.capacity) {
      this.points.push(point)
      return true
    } else {
      if (!this.divided) {
        this.subdivide()
      }
      if (this.northeast.insert(point)) return true
      if (this.northwest.insert(point)) return true
      if (this.southeast.insert(point)) return true
      if (this.southwest.insert(point)) return true
    }
  }
  /**
   * 用于查询位于给定范围内的所有点。
   * 1. 检查当前节点的边界是否与查询范围相交，如果不相交，则直接返回一个空数组。
   * 2. 如果当前节点的边界与查询范围相交，则遍历当前节点内的所有点，并将位于查询范围内的点添加到 found 数组中。
   * 3. 如果当前节点已经分割成四个子节点，则递归地在每个子节点上执行查询操作，并将结果合并到 found 数组中。
   * 4. 最后，返回包含在查询范围内的所有点的 found 数组。
   */
  query(range, found) {
    if (!found) {
      found = []
    }

    if (!this.boundary.intersects(range)) {
      return found
    } else {
      for (let p of this.points) {
        if (range.contains(p)) {
          found.push(p)
        }
      }
      if (this.divided) {
        this.northeast.query(range, found)
        this.northwest.query(range, found)
        this.southeast.query(range, found)
        this.southwest.query(range, found)
      }
    }
    return found
  }
  // 清空四叉树
  clear() {
    this.points = []
    this.divided = false

    if (this.northeast) {
      this.northeast.clear()
      this.northeast = null
    }
    if (this.northwest) {
      this.northwest.clear()
      this.northwest = null
    }
    if (this.southeast) {
      this.southeast.clear()
      this.southeast = null
    }
    if (this.southwest) {
      this.southwest.clear()
      this.southwest = null
    }
  }
}
export { Quadtree, Rectangle }
