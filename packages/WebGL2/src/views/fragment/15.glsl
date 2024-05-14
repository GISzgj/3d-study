#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
in vec2 v_pin;
out vec4 outColor;
uniform sampler2D u_sampler;
void main() {
  outColor = texture(u_sampler, v_pin); 
}