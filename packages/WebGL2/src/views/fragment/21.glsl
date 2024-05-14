#version 300 es
precision highp float;
out vec4 outColor;
//起始位
vec2 u_start=vec2(100,100);
//结束位
vec2 u_end=vec2(700,700);
//节点颜色集合
vec4 colors[3];
//节点位置集合
float positions[3];
vec4 getColor(vec4 colors[3],float positions[3]){
  vec4 color=vec4(1);
  // 对角线向量
  vec2 diagonal=u_end-u_start;
  // 归一化对角线
  vec2 diagonalLine=normalize(diagonal);
  // 对角线长度
  float diagonalLength=length(diagonal);
  // 计算当前片源在起始终止向量的分量
  float curL=clamp(dot(vec2(gl_FragCoord),diagonalLine),0.,diagonalLength);
  float curLRatio=clamp(curL/diagonalLength,positions[0],positions[2]);
  // 写法一;
  /*   if(curLRatio>positions[0]&&curLRatio<positions[1]){
    color=colors[0]+(curLRatio-positions[0])*(colors[1]-colors[0])/(positions[1]-positions[0]);
  }else{
    color=colors[1]+(curLRatio-positions[1])*(colors[2]-colors[1])/(positions[2]-positions[1]);
  } */
  // 写法二;
  vec4 color1=colors[0];
  float position1=positions[0];
  for(int i=1;i<3;i++){
    vec4 color2=colors[i];
    float position2=positions[i];
    if(curLRatio>=position1&&curLRatio<=position2){
      float ratioInRatio=(curLRatio-position1)/(position2-position1);
      color=color1+(color2-color1)*ratioInRatio;
      break;
    }
    color1=color2;
    position1=position2;
  }
  return color;
}
void main(){
  colors[0]=vec4(1,0,0,1);
  colors[1]=vec4(1,1,0,1);
  colors[2]=vec4(0,1,0,1);
  positions[0]=0.;
  positions[1]=.5;
  positions[2]=1.;
  outColor=getColor(colors,positions);
}