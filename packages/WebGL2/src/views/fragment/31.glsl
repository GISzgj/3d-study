#version 300 es
precision highp float;
const float pi2=radians(360.);
in vec2 v_pin;
out vec4 fragColor;
uniform vec2 u_canvasSize;
uniform sampler2D u_sampler;
// 获取向量角度
float getAngle(vec2 v){
  float ang=atan(v.y,v.x);
  if(ang<0.){
    ang+=pi2;
  }
  return ang;
}
void main(){
  vec2 vcf=gl_FragCoord.xy-u_canvasSize/2.;
  float ang=getAngle(vcf);
  float len=length(vcf);
  // xy是ang和len的归一化
  float x=ang/pi2;
  float y=len/u_canvasSize.y;
  // 正常贴图: 贴图执行第一帧像素在左上角0，0；    查看图钉的位置是1，0；对应到图形的栅格坐标系中的0，0； 这个像素画到图元上
  // vec4 color=texture(u_sampler,v_pin);
  // vec4 color=texture(u_sampler,gl_FragCoord.xy/u_canvasSize);
  // 极坐标扭曲， 图钉的坐标系是uv坐标系
  vec4 color=texture(u_sampler,vec2(x,y));
  if(vcf.x>0.&&abs(vcf.y)<.00001){
    color=texture(u_sampler,vec2(0,y));
  }
  fragColor=color;
}