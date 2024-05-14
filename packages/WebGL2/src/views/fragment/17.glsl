#version 300 es
precision highp float;
in vec2 v_pin;
out vec4 outColor;
uniform float u_ratio;
uniform sampler2D u_mask;
uniform sampler2D u_sampler;
uniform sampler2D u_pattern1;
uniform sampler2D u_pattern2;

void main() {
  vec4 o = texture(u_sampler, v_pin);
  vec4 m = texture(u_mask, v_pin);
  vec4 p1 = texture(u_pattern1, v_pin);
  vec4 p2 = texture(u_pattern2, v_pin);
  vec4 p3 = vec4(1,1,1,1);
  if(m.r > 0.5){
    p3 = mix(p1, p2, u_ratio);
  }
  outColor = o * p3;
}