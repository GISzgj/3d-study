#version 300 es

in vec4 a_position;
in vec4 a_color;
out vec4 v_color;
// 设置全局变量
// uniform mat4 u_matrix;
void main() {
  // 将位置乘以矩阵
  // gl_Position = u_matrix * a_position;
  gl_Position = a_position;
  gl_PointSize = 40.0;
  // 将颜色传递给片段着色器
  v_color = a_color;
}
