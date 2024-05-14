#version 300 es

in vec4 a_position;
uniform mat4 u_projectionMatrix;
void main(){
  // 将位置乘以矩阵
  gl_Position=u_projectionMatrix*a_position;
}
