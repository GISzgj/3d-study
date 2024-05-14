#version 300 es
precision highp float;
in vec2 v_pin;
out vec4 outColor;
uniform sampler2D u_sampler;
uniform sampler2D u_pattern;
uniform sampler2D u_mask;
uniform float u_ratio;
uniform int u_synType;
void main() {
  vec4 o = texture(u_sampler, v_pin); 
  vec4 p = texture(u_pattern, v_pin);
  if(u_synType == 1){
    // 正片叠底； 颜色叠加；算法会让原始图片的亮度变暗
    outColor = p * o;
  }else if(u_synType == 2){
    // 混合
    outColor = mix(o, p, 0.5);
  }else if(u_synType == 3){
    outColor = mix(o, p, u_ratio);
  }else if(u_synType == 4){
    vec4 m = texture(u_mask, v_pin);
    float f = clamp((m.g+ u_ratio), 0.0, 1.0);
    outColor = mix(o, p, f);
  }
}