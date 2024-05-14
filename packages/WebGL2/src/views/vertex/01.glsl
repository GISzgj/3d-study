#version 300 es

in vec2 a_position;
// 设置全局变量
uniform vec2 u_resolution;
uniform mat3 u_matrix;
void main() {
  // 将位置乘以矩阵
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;
  // vec2 position = rotatedPosition + u_translation;

  // vec2 zeroToOne = position / u_resolution;

  // // convert from 0->1 to 0->2
  // vec2 zeroToTwo = zeroToOne * 2.0;

  // // convert from 0->2 to -1->+1 (clip space)
  // vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(position, 0, 1);
}
