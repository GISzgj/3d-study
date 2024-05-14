#version 300 es

in vec3 a_position;
// 设置全局变量
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
void main() {
  // 将位置乘以矩阵
  gl_Position = u_modelMatrix * u_viewMatrix * vec4(a_position, 1.0);
}
