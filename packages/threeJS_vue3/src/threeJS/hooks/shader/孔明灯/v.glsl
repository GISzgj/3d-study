precision highp float;
uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;
varying float vTime;
varying vec3 gPosition;
void main(){
  vTime=uTime;
  vUv=uv;
  vec4 modelPosition=modelMatrix*vec4(position,1.);
  vPosition=modelPosition.xyz;
  gPosition=position.xyz;
  gl_Position=projectionMatrix*viewMatrix*modelPosition;
}