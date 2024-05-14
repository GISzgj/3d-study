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
float getBright(vec2 pole){
  float ang=atan(pole.y,pole.x);
  float x=ang*16.;
  vec2 v=vec2(int(x),0);
  return rand(v);
}
void main(){
  // 根据时间戳u_stamp建立旋转矩阵;
  float angOffset=u_stamp*.0004;
  //  modelMatrix1 是用于旋转片元位的
  mat2 modelMtrix1=mat2(
    cos(angOffset),-sin(angOffset),
    sin(angOffset),cos(angOffset)
  );
  // modelMatrix2 是用于旋转极点的。注意旋转中心应该是画布中心; 先移动到原点, 进行旋转, 再移动回来
  float angOffset2=u_stamp*.0008;
  mat2 modelMatrix2=mat2(
    cos(angOffset2),-sin(angOffset2),
    sin(angOffset2),cos(angOffset2)
  );
  vec2 center=u_canvasSize/2.;
  // 一. 建立极点1
  // 1. 建立极坐标系, 定义原点为画布中心
  vec2 vcf=gl_FragCoord.xy-(center+modelMatrix2*(u_canvasSize*.67-center));
  // 2. 获取不同极坐标的亮度颜色
  float bright1=getBright(modelMtrix1*vcf);
  // 二. 建立极点2
  // 极点位置
  vec2 polyPosition2=u_canvasSize*.33;
  // 极点旋转
  vec2 rotatedPolyPosition2=center+modelMatrix2*(polyPosition2-center);
  vec2 vcf2=gl_FragCoord.xy-rotatedPolyPosition2;
  float bright2=getBright(modelMtrix1*vcf2);
  float f=0.;
  float sum=bright1+bright2;
  if(sum>1.){
    f=bright1*bright2;
  }else{
    f=sum;
  }
  outColor=vec4(f+.2,f-.2,f+.3,1.);
  
}