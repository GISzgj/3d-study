precision highp float;
uniform float uTime;
uniform float uSize;
varying vec2 vUv;
varying float vTime;
attribute vec3 startPointdirection;
void main(){
  vTime=uTime;
  vUv=uv;
  vec4 modelPosition=modelMatrix*vec4(position,1.);
  modelPosition.xyz+=startPointdirection*uTime;
  gl_Position=projectionMatrix*viewMatrix*modelPosition;
  gl_PointSize=uSize+uTime;
}