import { ElMessageBox, ElMessage } from 'element-plus'

interface Tool {
  data: {
    set: (table: string, settings: any) => void
    get: (table: string) => any
    remove: (table: string) => void
    clear: () => void
  }
  session: {
    set: (table: string, settings: any) => void
    get: (table: string) => any
    remove: (table: string) => void
    clear: () => void
  }
  groupSeparator: (num: number | string) => string
  dictList: (dictValue: string) => { value: string; label: string }[]
  getHost: () => string
  formatExcelDate: (numb: number, format?: string) => string
  dictDataAll?: () => { dictValue: string; children: { dictValue: string; name: string }[] }[]
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

  // 获取某个code下字典的列表，基于dictTypeList 改进，保留老的，逐步替换
  dictList(dictValue: string): { value: string; label: string }[] {
    const dictTypeTree = this.dictDataAll ? this.dictDataAll() : []
    if (!dictTypeTree) {
      return []
    }
    const tree = dictTypeTree.find(item => item.dictValue === dictValue)
    if (tree) {
      return tree.children.map(item => {
        return {
          value: item['dictValue'],
          label: item['name']
        }
      })
    }
    return []
  },

  // 获取主机域名
  getHost(): string {
    return window.location.origin
  },

  // EXCEL时间格式化
  formatExcelDate(numb: number, format: string = '/'): string {
    const time = new Date(
      (numb - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000
    )
    time.setFullYear(time.getFullYear())
    const year = time.getFullYear() + ''
    const month = (time.getMonth() + 1).toString().padStart(2, '0')
    const date = time.getDate().toString().padStart(2, '0')
    if (format && format.length === 1) {
      return year + format + month + format + date
    }
    return year + month + date
  }
}

export default tool
