precision lowp float;
varying vec2 vUv;
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
// 每个顶点都会调用这个函数
void main(){
  vUv = uv;
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  gl_Position =  projectionMatrix * viewMatrix *modelPosition;
}