#version 300 es
precision highp float;
const float pi2=radians(360.);
out vec4 fragColor;
uniform vec2 u_canvasSize;
uniform sampler2D u_sampler;

void main(){
  vec2 center=u_canvasSize/2.;
  
  fragColor=vec4(1.);
}