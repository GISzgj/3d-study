#version 300 es
precision highp float;
const float pi2=radians(360.);
in vec2 v_pin;
out vec4 fragColor;
uniform vec2 u_canvasSize;
uniform sampler2D u_sampler;
float a=.5;
//渐变,正弦型放射
float gradient(float ang){
  return a*sin(4.*ang)+.5;;
}
//水平拉丝
float wire(vec2 v){
  vec2 a=vec2(0.,1.);
  float n=dot(v,a);
  return fract(tan(n)*10000.);
}

//杂色
float noise(vec2 v){
  vec2 a=vec2(.1234,.5678);
  float n=dot(v,a);
  return fract(tan(n)*10000.);
}

// 获取向量角度
float getAngle(vec2 v){
  float ang=atan(v.y,v.x);
  if(ang<0.){
    ang+=pi2;
  }
  return ang;
}
void main(){
  vec2 center=u_canvasSize/2.;
  // 建立极坐标系
  vec2 vcf=gl_FragCoord.xy-center;
  //极径(非负值)
  float len=length(vcf);
  //极角
  float ang=getAngle(vcf);
  // 归一化: x, y => [0,1]
  float x=u_canvasSize.x*ang/pi2;
  float y=(len/(length(center)))*u_canvasSize.y;
  //渐变
  float f1=gradient(ang);
  f1=.65*f1+.5;
  //拉丝
  float f2=wire(vec2(int(x),int(y)));
  f2=clamp(f2,.75,.8);
  //杂色
  float f3=noise(gl_FragCoord.xy);
  f3*=.07;
  vec4 color=vec4(f2+f3,f2+f3,f2+f3,1.);
  // vec4 color=vec4(f1*f2,f1*f2,f1*f2,1.);
  
  fragColor=color;
}