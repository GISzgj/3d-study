#version 300 es

in vec4 a_position;
in vec4 a_color;
out vec4 v_color;
// 设置全局变量
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
void main() {
  // 将位置乘以矩阵
  gl_Position =  u_viewMatrix * u_modelMatrix * a_position;
  gl_PointSize = 40.0;
  v_color = a_color;
}
