#version 300 es
precision highp float;
in vec2 v_pin;
out vec4 outColor;
uniform sampler2D u_sampler;

void main() {
  outColor = texture(u_sampler, v_pin);
}