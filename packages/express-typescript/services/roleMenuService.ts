import { getOne, exec } from '../db/mysql'
const QueryAuthMenuByRoleId = `
  SELECT
      menu.id AS id,
      menu.path AS path,
      menu.title AS title,
      menu.icon AS icon,
      menu.code_path AS codePath,
      menu.type AS type,
      menu.parent_id AS parentId
  FROM
      sys_menu menu
  JOIN
      sys_role_menu srm ON menu.id = srm.menu_id
  JOIN
      sys_role role ON srm.role_id = role.id
  WHERE
      role.id = ?;
`
class RoleMenuService {
  static async getRoleMenu(roleId: number) {
    function buildTree(routes: any[]) {
      const routeMap = new Map()
      routes.forEach(route => {
        route.meta = {
          title: route.title,
          icon: route.icon
        }
        delete route.title
        delete route.icon
        route.children = []
        routeMap.set(route.id, route)
      })
      const tree: any = []
      routes.forEach(route => {
        if (route.parentId === 0) {
          tree.push(route)
        } else {
          const parent = routeMap.get(route.parentId)
          if (parent) {
            parent.children.push(route)
          }
        }
      })
      return tree
    }
    try {
      const result = await exec(QueryAuthMenuByRoleId, [roleId])
      if (result) {
        // 构建树形结构
        return buildTree(result)
      } else {
        throw new Error('获取菜单失败')
      }
    } catch (error) {
      throw error
    }
  }
}

export default RoleMenuService
