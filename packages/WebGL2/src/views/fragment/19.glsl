#version 300 es
precision highp float;
in vec2 v_pin;
out vec4 outColor;
uniform sampler2D u_sampler;

void main() {
  mat2 m2 = mat2(
    1.0,5.0,
    6.0,13.0
  );

  vec4 f = vec4(20.0,40.0,50.0,80.0);
  // outColor = texture(u_sampler, v_pin);
  outColor = vec4(m2[0],0.0,0.0) / 255.0;
}