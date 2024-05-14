export function modifyMap(viewer, options) {
  const baseLayer = viewer.imageryLayers.get(0)
  baseLayer.brightness = options.brightness || 0.6
  baseLayer.contrast = options.contrast || 1.8
  baseLayer.gamma = options.gamma || 0.3
  baseLayer.hue = options.hue || 1
  baseLayer.saturation = options.saturation || 0
  const baseFragShader = viewer.scene.globe._surfaceShaderSet.baseFragmentShaderSource.sources
  const strS = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
  for (let i = 0; i < baseFragShader.length; i++) {
    let strT = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
    let str = `
    color.r = color.r * ${options.filterObjRGB.r}.0/255.0;
    color.g = color.g * ${options.filterObjRGB.g}.0/255.0;
    color.b = color.b * ${options.filterObjRGB.b}.0/255.0;
  `
    if (options.invertColor) {
      strT += `
    color.r = 1.0 - color.r;
    color.g = 1.0 - color.g;
    color.b = 1.0 - color.b;
    `
    }
    if (options.filterObjRGB) {
      strT += `
    color.r = color.r * ${options.filterObjRGB.r}.0/255.0;
    color.g = color.g * ${options.filterObjRGB.g}.0/255.0;
    color.b = color.b * ${options.filterObjRGB.b}.0/255.0;`
    }
    baseFragShader[i] = baseFragShader[i].replace(strS, strT)
    viewer.scene.requestRender()
  }
}
export function resetMap(viewer) {
  const baseFragShader = viewer.scene.globe._surfaceShaderSet.baseFragmentShaderSource.sources
  const pattern =
    /color\.[rgb]\s*=\s*color\.[rgb]\s*\*\s*\d+(\.\d+)?\/\d+(\.\d+)?;\n\s*color\.[rgb]\s*=\s*color\.[rgb]\s*\*\s*\d+(\.\d+)?\/\d+(\.\d+)?;\n\s*color\.[rgb]\s*=\s*color\.[rgb]\s*\*\s*\d+(\.\d+)?\/\d+(\.\d+)?;/g
  const pattern2 =
    /color\.r = 1\.0 - color\.r;\s+color\.g = 1\.0 - color\.g;\s+color\.b = 1\.0 - color\.b;/
  for (let i = 0; i < baseFragShader.length; i++) {
    const regMatchStr = baseFragShader[i].match(pattern)
    const regMatchStr2 = baseFragShader[i].match(pattern2)
    if (regMatchStr2) {
      baseFragShader[i] = baseFragShader[i].replace(regMatchStr2[0], '')
    }
    if (regMatchStr) {
      console.log('匹配到regMatchStr')
      baseFragShader[i] = baseFragShader[i].replace(regMatchStr[0], '')
    }
  }
}
