#version 300 es
precision highp float;
out vec4 outColor;
uniform float u_ang;
uniform vec2 u_canvasSize;
// fract函数只取小数部分的值
// 根据u_ang建立旋转矩阵;
// 1. 杂色与动态杂色
float rand(vec2 fragCoord,mat2 m){
  fragCoord=m*fragCoord;
  vec2 a=vec2(.1234,.5678);
  float n=dot(fragCoord,a);
  return fract(sin(n)*10000.);
}
// 2. 肌理与肌理动画
float regular(vec2 fragCoord,mat2 m){
  // fragCoord=m*fragCoord;
  vec2 a=vec2(.1234,.5678);
  float n=dot(fragCoord,a);
  // 修改此数控制肌理变换
  float r=10.;
  // return fract(sin(n)*r);
  return fract(tan(n)*r);
}
// 3. 拉丝;a取得是对角线
float wire(vec2 fragCoord,mat2 m){
  // fragCoord=m*fragCoord;
  fragCoord=fragCoord;
  vec2 a=vec2(.1234,.1234);
  float n=dot(fragCoord,a);
  return fract(sin(n)*10000.);
}
// 4. 其它
float other(vec2 fragCoord,mat2 m){
  // v指的是片元到中心点的向量
  vec2 v=fragCoord-u_canvasSize/2.;
  return fract(
    // 极角
    atan(v.y,v.x)*500.
  );
}
void main(){
  mat2 m=mat2(
    cos(u_ang),sin(u_ang),
    -sin(u_ang),cos(u_ang)
  );
  // 1. 杂色
  // float f=rand(gl_FragCoord.xy,m);
  // 2. 肌理
  // float f=regular(gl_FragCoord.xy,m);
  // 3. 拉丝
  // float f=wire(gl_FragCoord.xy,m);
  // 4. 其它
  float f=other(gl_FragCoord.xy,m);
  // rgb 三个颜色相同就是灰色;
  // 对于屏幕显示而言，不发光状态下是黑色(0, 0, 0)，另一段是RGB全部拉到最强的白色(255, 255, 255)。RGB数值相同可以理解为保持相同的RGB 比重，为黑色添加一定比例的白色，结果自然就是灰色。
  outColor=vec4(f,f,f,1.);
  
}