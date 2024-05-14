#version 300 es

in vec2 a_position;
in vec4 a_color;
in float a_pointSize;
out vec4 v_color;
// 设置全局变量
uniform mat3 u_matrix;
void main() {
  // 将位置乘以矩阵
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
  // gl_Position = a_position;
  gl_PointSize = a_pointSize;
  // 将颜色传递给片段着色器
  v_color = a_color;
}
