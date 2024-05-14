#version 300 es
in vec4 a_position;
uniform mat4 u_pvMatrix;
uniform mat4 u_modelMatrix;
void main(){
  // 将位置乘以矩阵
  gl_Position=u_pvMatrix*u_modelMatrix*a_position;
}
