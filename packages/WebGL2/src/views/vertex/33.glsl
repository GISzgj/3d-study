#version 300 es

in vec4 a_position;
in vec2 a_pin;
out vec2 v_pin;
void main(){
  // 将位置乘以矩阵
  gl_Position=a_position;
  v_pin=a_pin;
}
