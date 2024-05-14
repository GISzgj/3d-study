#define PI 3.14159265359
precision lowp float;
varying vec2 vUv;
uniform float uTime;
// 随机函数,st.xy 二维uv向量
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))* 43758.5453123);
}
// 旋转函数
vec2 rotate(vec2 uv, float _angle, vec2 mid){
    return vec2(cos(_angle) * (uv.x - mid.x) + sin(_angle) * (uv.y - mid.y) + mid.x, cos(_angle) * (uv.y -mid.y) - sin(_angle) * (uv.x - mid.x) + mid.y); 
}
// 利用顶点着色器传递的uv坐标，实现纹理的偏移
void main(){
  // float strength = 1.0 - vUv.y;
  // gl_FragColor = vec4( strength,strength, strength, 1.0 );
  // 反复(百叶窗)
  // float strength = mod(vUv.y * 10.0,1.0);
  // gl_FragColor = vec4( strength,strength, strength, 1.0 );
  // 跳跃(斑马)
  // float strength = step(0.5,mod(vUv.y * 10.0,1.0))*0.8; 
  // gl_FragColor = vec4( strength,strength, strength, 1.0 );
  // 格子窗
  // float strength = step(0.5,mod(vUv.y * 10.0,1.0))*0.8; 
  // strength += step(0.5,mod(vUv.x * 10.0,1.0))*0.8;
  // gl_FragColor = vec4( strength,strength, strength, 1.0 );
  // //  
  // float strength =1.0 - step(0.1,abs(vUv.x - 0.5)); 
  // strength += step(0.3,abs(vUv.y - 0.5));
  // gl_FragColor = vec4( strength,strength, strength, 1.0 );
  // 
  // float strength = (floor(vUv.x * 10.0)/10.0 * ceil(vUv.y * 10.0)/10.0) + 0.1;
  // gl_FragColor = vec4( strength,strength, strength, 1.0 );
  // 随机效果
  // float strength = (floor(vUv.x * 10.0)/10.0 * ceil(vUv.y * 10.0)/10.0) * random(vUv) ;
  // gl_FragColor = vec4( strength,strength, strength, 1.0 );
  // vec2 strength = vUv.xy;
  // gl_FragColor = vec4( strength, 1.0, 1.0 );

  // // distance
  // float strength =   0.15 / distance(vec2((vUv.x + 1.5) / 4.0, (vUv.y + 0.5) / 2.0),vec2(0.5,0.5)) - 1.0;
  // gl_FragColor = vec4( strength,strength, strength,1.0);
  // 旋转十字交叉的发光效果
  // vec2 rotateUv = rotate(vUv, uTime / 500.0,vec2(0.5,0.5));
  // float strength = 0.15 / distance(vec2(rotateUv.x, (rotateUv.y - 0.5) * 5.0 + 0.5),vec2(0.5,0.5));
  // strength *=  0.15 / distance(vec2((rotateUv.x- 0.5)* 5.0+0.5, rotateUv.y) ,vec2(0.5,0.5));
  // gl_FragColor = vec4( strength,strength, strength,1.0);
  // 圆环
  // float strength = step(0.5, distance(vUv, vec2(0.5)) + 0.35);
  // strength *= 1.0 - step(0.5, distance(vUv, vec2(0.5, 0.5)) + 0.25);
  // gl_FragColor = vec4( strength,strength, strength,1.0);
  // 波浪环
  vec2 waveUv = vec2(vUv.x , vUv.y + sin(vUv.x * 30.0 + uTime /400.0 )*0.1 );
  float strength = 1.0 - step(0.01, distance(waveUv, vec2(0.5)) - 0.25);
  gl_FragColor = vec4( strength,strength, strength,1.0);
  // 实现雷达扫射
  // vec2 rotateUv = rotate(vUv, uTime / 500.0,vec2(0.5,0.5));
  // float alpha = 1.0 - step(0.5, distance(vUv, vec2(0.5)));
  // float angle = atan(rotateUv.x - 0.5, rotateUv.y - 0.5);
  // float strength = 1.0 - (angle + PI) / PI * 2.0 ;
  // gl_FragColor = vec4( strength,strength, strength,1.0);
}


