#define PI 3.14159265359
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // 屏幕中心
    vec2 center = iResolution.xy / 2.0;
    // 圆的半径
    float radius = min(iResolution.x, iResolution.y) * 0.4;
    // 计算当前像素到屏幕中心的距离
    float distanceToCenter = distance(center, fragCoord);
    // 计算颜色相位，使得颜色随时间无限旋转
    float colorPhase = iTime / 6.0; // 修改此处的除数可以调整旋转速度
    // 计算当前像素的角度，从而使颜色随着距离中心的增加而旋转
    float angle = atan(fragCoord.y - center.y, fragCoord.x - center.x);
    // 通过角度和时间来旋转颜色
    vec3 rainbowColor = vec3(
        sin(colorPhase + angle),
        sin(colorPhase + angle + 2.0 * PI / 3.0),
        sin(colorPhase + angle + 4.0 * PI / 3.0)
    );
    // 如果像素到中心的距离小于屏幕对角线的一半，则为彩虹色，否则为背景色
    if (distanceToCenter < length(center)) {
        fragColor = vec4(rainbowColor, 1.0);
    } else {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}