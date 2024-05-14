#version 300 es

in vec4 a_position;
// 设置全局变量
uniform mat3 u_matrix;
out float a_alpha;
void main() {
  // 将位置乘以矩阵
  gl_Position = vec4((u_matrix * vec3(a_position.xy, 1)).xy, 0, 1);
  gl_PointSize = a_position.z;
  a_alpha = a_position.w;
}
