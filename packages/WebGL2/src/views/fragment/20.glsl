#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 u_start;
uniform vec2 u_end;
uniform vec4 u_color0;
uniform vec4 u_color1;


void main() {
  // 对角线向量
  vec2 diagonal = u_end - u_start;
  // 归一化对角线
  vec2 diagonalLine = normalize(diagonal);
  // 对角线长度
  float diagonalLength = length(diagonal);
  vec4 color01 = u_color1-u_color0;
  // gl_FragCoord
  // outColor = vec4( gl_FragCoord.x / 2000.0, 0.0, 0.8, 1.0);
  // outColor = vec4( 1.0 - gl_FragCoord.x/u_canvasSize.x, 1.0-gl_FragCoord.y/u_canvasSize.y,0.8,1.0);
  // 归一化: gl_FragCoord是当前片元在canvas 画布中的像素位，其坐标系和canvas画布的坐标系类似，其坐标基底的两个分量都是一个像素的宽和高。
  // outColor = vec4( gl_FragCoord.x/u_canvasSize.x,gl_FragCoord.y/u_canvasSize.y,0.8,1.0);

  vec2 sf = vec2(gl_FragCoord) - u_start;
  float d = dot(sf, diagonalLine);
  outColor = u_color0 + color01 * d / diagonalLength;
}