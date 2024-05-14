#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
in vec4 v_color;
out vec4 outColor;
 
void main() {
  // outColor = vec4(0.5,0.91,1.0, 1.0);
  outColor = v_color;

}