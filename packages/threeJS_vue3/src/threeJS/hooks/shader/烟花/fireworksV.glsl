precision highp float;
uniform float uTime;
varying float vTime;
attribute vec3 direction;
attribute float scale;
uniform float uSize;
void main(){
  vTime=uTime;
  vec4 modelPosition=modelMatrix*vec4(position,1.);
  modelPosition.xyz+=normalize(direction)*uTime*10.;
  gl_Position=projectionMatrix*viewMatrix*modelPosition;
  gl_PointSize=uSize*scale-uTime*8.;
}