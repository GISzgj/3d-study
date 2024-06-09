import { ElMessageBox, ElMessage } from 'element-plus'
const localStorageTokenName = import.meta.env.VITE_TOKEN_NAME

interface Tool {
  data: {
    set: (table: string, settings: any) => void
    get: (table: string) => any
    remove: (table: string) => void
    clear: () => void
  }
  loginUtils: {
    getToken: () => string
    getAsyncMenus: () => any[]
    getUserData: () => any
    doLogin: (token: string, menus: any[], userData: string) => void
    logout: () => void
  }
  session: {
    set: (table: string, settings: any) => void
    get: (table: string) => any
    remove: (table: string) => void
    clear: () => void
  }
  groupSeparator: (num: number | string) => string
  getHost: () => string
}

const tool: Tool = {
  // localStorage
  data: {
    set(table: string, settings: any): void {
      const _set = JSON.stringify(settings)
      localStorage.setItem(table, _set)
    },
    get(table: string): any {
      let data = localStorage.getItem(table)
      try {
        data = data ? JSON.parse(data) : null
      } catch (err) {
        return null
      }
      return data
    },
    remove(table: string): void {
      localStorage.removeItem(table)
    },
    clear(): void {
      localStorage.clear()
    }
  },
  // 设置登录后的操作
  loginUtils: {
    getToken() {
      return tool.data.get(localStorageTokenName || 'token')
    },
    getAsyncMenus() {
      return tool.data.get('menus')
    },
    getUserData() {
      return tool.data.get('USER_DATA')
    },
    /**
     * @description 登录后,将需要缓存的东西缓存起来
     * @param token
     * @param menus
     */
    doLogin(token: string, menus: any[], userData: any) {
      tool.data.set(localStorageTokenName || 'token', token)
      tool.data.set('menus', menus)
      tool.data.set('USER_DATA', userData)
    },
    logout() {
      tool.data.remove(localStorageTokenName || 'token')
      tool.data.remove('menus')
      tool.data.remove('USER_DATA')
    }
  },
  // sessionStorage
  session: {
    set(table: string, settings: any): void {
      const _set = JSON.stringify(settings)
      sessionStorage.setItem(table, _set)
    },
    get(table: string): any {
      let data = sessionStorage.getItem(table)
      try {
        data = data ? JSON.parse(data) : null
      } catch (err) {
        return null
      }
      return data
    },
    remove(table: string): void {
      sessionStorage.removeItem(table)
    },
    clear(): void {
      sessionStorage.clear()
    }
  },
  // 千分符
  groupSeparator(num: number | string): string {
    num = `${num}`
    if (!num.includes('.')) num += '.'

    return num
      .replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => {
        return `${$1},`
      })
      .replace(/\.$/, '')
  },
  // 获取主机域名
  getHost(): string {
    return window.location.origin
  }
}

export default tool
