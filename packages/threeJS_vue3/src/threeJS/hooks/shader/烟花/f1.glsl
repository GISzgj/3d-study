precision highp float;
varying vec2 vUv;
varying float vTime;
uniform vec3 uColor;
void main(){
  vec4 color1=vec4(uColor,1);
  vec4 color2=vec4(0,0,0,1);
  // 画一个圆 辉光
  float distanceToCenter=distance(gl_PointCoord,vec2(.5,.5));
  float strength=distanceToCenter*2.;
  strength=1.-strength;
  strength=pow(strength,1.5);
  vec4 mixColor=mix(color2,color1,strength);
  
  gl_FragColor=mixColor;
}

