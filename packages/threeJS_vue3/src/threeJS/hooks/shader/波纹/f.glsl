precision highp float;
varying float vTime;
varying float uElevation;
void main(){
  float a=(uElevation+1.)/2.;
  vec4 topColor=vec4(.0235,.3137,.4784,1.);
  vec4 bottomColor=vec4(.1412,.1412,.1412,1.);
  
  gl_FragColor=mix(bottomColor,topColor,a);
}