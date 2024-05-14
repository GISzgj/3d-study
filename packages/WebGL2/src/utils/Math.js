/* 正弦函数 */
function SinFn(a, Omega, phi) {
  return function (x) {
    return a * Math.sin(Omega * x + phi)
  }
}
//线性比例尺
function ScaleLinear(ax, ay, bx, by) {
  const delta = {
    x: bx - ax,
    y: by - ay
  }
  const k = delta.y / delta.x
  const b = ay - ax * k
  return function (x) {
    return k * x + b
  }
}
export { SinFn, ScaleLinear }
