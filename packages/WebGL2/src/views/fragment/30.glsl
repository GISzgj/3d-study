#version 300 es
precision highp float;
out vec4 fragColor;
uniform float u_stamp;
uniform vec2 u_canvasSize;
// 正弦型函数: y=Asin(ωx+φ);φ 影响的是正弦曲线的平移;ω 影响的是正弦曲线的周期，ω 越大，周期越小
// omega 对应的是正弦函数式里的ω，在放射效果中此值会影响射线的数量
// a 对应的是正弦函数式里的A，在放射效果中此值会影响亮度
float omega=7.;
float a=.5;
// 根据顶点建立极坐标; p是指的canvas画布中的坐标
float getBrightBySin(vec2 p){
  
  // 以画布坐标p建立极坐标系
  vec2 vpf=gl_FragCoord.xy-p;
  float ang=atan(vpf.y,vpf.x);
  // 以极角为变量计算正弦函数值
  return a*sin(omega*ang)+.5;
}
void main(){
  // 根据时间戳u_stamp建立旋转矩阵;
  float angOffset=u_stamp*.0004;
  mat2 rotateAng=mat2(
    cos(angOffset),-sin(angOffset),
    sin(angOffset),cos(angOffset)
  );
  vec2 center=u_canvasSize/2.;
  // 先位移在旋转, 再位移回去
  vec2 position1=center+rotateAng*(u_canvasSize*.4-center);
  vec2 position2=u_canvasSize*.5;
  float f1=getBrightBySin(position1);
  float f2=getBrightBySin(position2);
  float f=(f1+f2);
  if(f>=1.){
    f=f1*f2;
  }else{
    f=f1+f2;
  }
  fragColor=vec4(f1,f1,f1,1.);
  fragColor=vec4(f2,f2,f2,1.);
  fragColor=vec4(f,f,f,1.);
}