precision highp float;
varying vec2 vUv;
varying float vTime;
varying vec3 vPosition;
varying vec3 gPosition;
void main(){
  vec4 color1=vec4(1,1,.5,1);
  vec4 color2=vec4(1,0,0,1);
  vec4 mixColor=mix(color1,color2,gPosition.y/3.);
  // vec4 mixColor=mix(color1,color2,60.);
  if(gl_FrontFacing){
    // gl_FragColor=vec4(.0,0.,0.,1.);
    // gl_FragColor=vec4(mixColor*.9);
    gl_FragColor=vec4(mixColor.xyz-(vPosition.y-10.)/80.-.05,1.);
    
  }else{
    gl_FragColor=vec4(mixColor.xyz,1);
  }
}