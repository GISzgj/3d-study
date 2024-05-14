#version 300 es
precision highp float;
out vec4 outColor;
uniform mat4 u_colorStops;
//点1
vec2 p1=vec2(800,600);
vec4 c1=vec4(0,1,1,1);
//点2
vec2 p2=vec2(400,900);
vec4 c2=vec4(1,0,1,1);
//点3
vec2 p3=vec2(200,200);
vec4 c3=vec4(1,1,0,1);
float pi2=radians(360.);
float getAngle(vec2 v){
  float ang=atan(v.y,v.x);
  if(ang<0.){
    ang+=pi2;
  }
  return ang;
}
void main(){
  // 点p1、p2和当前片元位相对于p3点的弧度。
  float ang31=getAngle(p1-p3);
  float ang32=getAngle(p2-p3);
  vec2 v3f=gl_FragCoord.xy-p3;
  float ang3f=getAngle(v3f);
  // 用叉乘计算当前片元在向量p2p1的哪一侧
  vec2 v1f=gl_FragCoord.xy-p1;
  float z=cross(vec3(v1f,0.),vec3(p2-p1,0.)).z;
  // 将片元限制在三角形中
  if(ang3f>=ang31&&ang3f<=ang32&&z<=0.){
    // 进行渐变
    //计算∠<v3f,p3p1>在∠<p3p2,p3p1>中的比值
    ang3f=clamp(ang3f,ang31,ang32);
    float angRatio=(ang3f-ang31)/(ang32-ang31);
    //向量v12和向量v3f的交点位置和颜色
    vec2 p4=p1+(p2-p1)*angRatio;
    vec4 c4=c1+(c2-c1)*angRatio;
    //向量p3-gl_FragCoord在向量p3p4中的长度比
    float lenE=distance(p4,p3);
    float lenF=length(v3f);
    float lenRatio=lenF/lenE;
    //基于长度比获取当前片元在c3、c4间的颜色
    outColor=c3+(c4-c3)*lenRatio;
  }else{
    outColor=vec4(0,0,0,1);
  }
}