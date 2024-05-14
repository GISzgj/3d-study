import Focus from './focus'
import Resize from './resize'
const directives = {
  Focus,
  Resize
}
export default {
  install(app) {
    Object.keys(directives).forEach(key => {
      directives[key](app)
    })
  }
}
