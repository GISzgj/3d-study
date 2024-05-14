const _tool = {}
// localStorage
_tool.data = {
  set(table, settings) {
    const _set = JSON.stringify(settings)
    return localStorage.setItem(table, _set)
  },
  get(table) {
    let data = localStorage.getItem(table)
    try {
      data = JSON.parse(data)
    } catch (err) {
      return null
    }
    return data
  },
  remove(table) {
    return localStorage.removeItem(table)
  },

  clear() {
    return localStorage.clear()
  }
}
export const $tool = _tool
