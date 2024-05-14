#version 300 es
precision highp float;
out vec4 outColor;
uniform mat4 u_colorStops;
//起始位 结束位
uniform vec2 u_start;
uniform vec2 u_end;

vec4 getColor(vec4 colors[8],float positions[8]){
  int pLength=8;
  vec4 color=vec4(1);
  // 对角线向量
  vec2 diagonal=u_end-u_start;
  // 归一化对角线
  vec2 diagonalLine=normalize(diagonal);
  // 对角线长度
  float diagonalLength=length(diagonal);
  // 计算当前片源在起始终止向量的分量
  float curL=clamp(dot(vec2(gl_FragCoord),diagonalLine),0.,diagonalLength);
  float curLRatio=clamp(curL/diagonalLength,positions[0],positions[pLength-1]);
  vec4 color1=colors[0];
  float position1=positions[0];
  for(int i=1;i<pLength;i++){
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
void analysisData(int rgb,int ar,out vec4 color,out float position){
  int rc=rgb/1000000;
  int gc=(rgb-rc*1000000)/1000;
  int bc=rgb-int(rgb/1000)*1000;
  int ac=ar/1000;
  int ratioI=ar-ac*1000;
  color=vec4(float(rc),float(gc),float(bc),float(ac))/255.;
  position=float(ratioI)/255.;
}
// setColorStops() 将u_colorStops 中的数据解析入节点颜色集合和位置集合
// out: 浅复制; in: 深层复制;
void setColorStops(out vec4 colors[8],out float positions[8]){
  //节点颜色数据
  vec4 colorSource=vec4(1);
  //节点位置数据
  float positionSource=1.;
  // 遍历四维矩阵; y轴为行,x轴为列;
  for(int y=0;y<4;y++){
    for(int x=0;x<2;x++){
      int rgb=int(u_colorStops[y][x*2]);
      int ap=int(u_colorStops[y][x*2+1]);
      if(rgb>0){
        // 解析rgb和ap数据
        analysisData(rgb,ap,colorSource,positionSource);
      }
      colors[2*y+x]=colorSource;
      positions[2*y+x]=positionSource;
    }
  }
}

void main(){
  //节点颜色集合
  vec4 colors[8];
  //节点位置集合
  float positions[8];
  //基于四维矩阵解析节点集合.并写入colors和positions数组中.
  setColorStops(colors,positions);
  outColor=getColor(colors,positions);
}