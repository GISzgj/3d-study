#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
uniform vec4 u_color;
// 从顶点着色器传递过来颜色
in float v_color;
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
  if(dist < 0.5) {
    outColor = vec4(0.5,0.91,1.0, v_color);
  }else{
    discard;
  }
}