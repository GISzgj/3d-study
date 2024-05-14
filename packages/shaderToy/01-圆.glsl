// 一个函数，它的输入fragCoord是每个像素点的坐标，以及带有out关键字的变量是你要提交出去的这个像素点的颜色
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  // 这里可以写入你的着色器代码
  // 例如，你可以根据fragCoord计算像素的颜色
  // 或者从纹理中采样颜色
  // 最后，将颜色赋值给输出变量fragColor
  /* 
    1. 画出一个圆
   */
 // 屏幕中心
    vec2 center = iResolution.xy / 2.0;
    
    // 圆的半径
    float radius = min(iResolution.x, iResolution.y) * 0.4;
    
    // 计算当前像素到圆心的距离
    float distanceToCenter = distance(center, fragCoord);
    
    // 如果像素到圆心的距离小于半径，则为圆内部，颜色为红色，否则为背景色
    if (distanceToCenter < radius) {
        fragColor = vec4(0.5, 0.6, 0.0, 1.0); // 红色
    } else {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0); // 背景色
    }
}