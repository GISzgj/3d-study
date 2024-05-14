#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 u_canvasSize;
uniform float u_stamp;
const float pi2=radians(360.);
float rand(vec2 fragCoord){
  vec2 a=vec2(.1234,.5678);
  float n=dot(fragCoord,a);
  return fract(sin(n)*10000.);
}
void main(){
  // 根据时间戳u_stamp建立旋转矩阵
  float angOffset=u_stamp*.001;
  mat2 modelMtrix=mat2(
    cos(angOffset),-sin(angOffset),
    sin(angOffset),cos(angOffset)
  );
  // 1. 建立极坐标系
  vec2 vcf=gl_FragCoord.xy-u_canvasSize/2.;
  // 应用旋转
  vcf=modelMtrix*vcf;
  // 2. 根据极坐标提取
  float ang=atan(vcf.y,vcf.x);
  float x=ang*15.;
  vec2 v=vec2(int(x),0.);
  // float f=1.;
  float f=rand(v);
  outColor=vec4(f+.2,f-.2,f+.3,1.);
  
}