const jsFiles = import.meta.glob('/src/threeJS/hooks/*.js')
// const jsFiles = import.meta.glob('/src/threeJS/hooks/shader/code/*.js')
// const jsFiles = import.meta.glob('/src/threeJS/hooks/shader/孔明灯/*.js')
// const jsFiles = import.meta.glob('/src/threeJS/hooks/shader/波纹/*.js')
// const jsFiles = import.meta.glob('/src/threeJS/hooks/shader/烟花/*.js')
const executeThreeJS = index => {
  const lastIndex = Object.keys(jsFiles).length - 1
  const executeIndex = index || lastIndex
  let currentIndex = 0
  for (let key in jsFiles) {
    if (currentIndex === executeIndex) {
      const file = jsFiles[key]
      return file()
    }
    currentIndex++
  }
}
export default {
  executeThreeJS
}
