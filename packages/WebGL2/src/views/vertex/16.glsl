#version 300 es

in vec4 a_position;
in vec2 a_pin;
out vec2 v_pin;
// 设置全局变量
uniform mat4 u_viewMatrix;
void main() {
  // 将位置乘以矩阵
  gl_Position = u_viewMatrix * a_position;
  v_pin = a_pin;
}
