#version 300 es
in vec4 a_position;
uniform mat4 u_pvMatrix;
void main(){
  // 将位置乘以矩阵
  gl_Position=u_pvMatrix*a_position;
}
