#version 300 es

in vec4 a_position;
// 设置全局变量

void main(){
  // 将位置乘以矩阵
  gl_Position=a_position;
}
