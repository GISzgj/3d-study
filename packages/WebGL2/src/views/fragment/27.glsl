#version 300 es
precision highp float;
out vec4 outColor;
uniform float u_ang;
uniform vec2 u_canvasSize;
const float pi2=radians(360.);
float rand(vec2 fragCoord){
  vec2 a=vec2(.1234,.5678);
  float n=dot(fragCoord,a);
  return fract(sin(n)*10000.);
}
void main(){
  mat2 m=mat2(
    cos(u_ang),sin(u_ang),
    -sin(u_ang),cos(u_ang)
  );
  // 1. 计算画布中心位置
  vec2 center=u_canvasSize/2.;
  // 2. 以画布中心为极点,建立极坐标系
  vec2 vcf=gl_FragCoord.xy-center;
  float ang=atan(vcf.y,vcf.x);
  // 3. 以极角为基准,随机生成一个数
  float x=ang*16.;
  // 4. 将x值拼上一个随意的y值，构成向量v; 向量v可以表示x列y行的位置; x是离散值
  vec2 v=vec2(int(x),0.);
  // 5. 基于向量v，通过rand() 方法生成一个颜色
  float f=rand(v);
  
  // rgb 三个颜色相同就是灰色;
  // 对于屏幕显示而言，不发光状态下是黑色(0, 0, 0)，另一段是RGB全部拉到最强的白色(255, 255, 255)。RGB数值相同可以理解为保持相同的RGB 比重，为黑色添加一定比例的白色，结果自然就是灰色。
  outColor=vec4(f,f,f,1.);
  
}