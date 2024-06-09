import { getOne, exec } from '../db/mysql'
const QueryByUserNameAndPwd = `
  SELECT 
      u.*, 
      r.id as role_id,
      r.role_name
  FROM 
      sys_user u
  JOIN 
      sys_role r 
  ON 
      u.role_id = r.id
  WHERE 
      u.user_name = ? AND u.password = ?;`
// 根据用户id更新登录时间
const UpdateUserById = 'UPDATE sys_user SET ? WHERE id = ?'
const CheckUserExistsQuery = `
  SELECT 
      1 
  FROM 
      sys_user 
  WHERE 
      user_name = ? AND deleted = 0;`

const QueryByRoleId = `
      SELECT role_name 
      FROM sys_role 
      WHERE id = ?;`

const InsertUserQuery = `
  INSERT INTO sys_user (user_name, nickname, password, role_id, role_name, create_time, update_time) 
  VALUES (?, ?, ?, ?, ?, ?, ?);`

class UserService {
  static async getUserInfo(userName: string, password: string) {
    try {
      const result = await getOne(QueryByUserNameAndPwd, [userName, password])
      if (result) {
        console.log(result)
        // 更新登录时间
        await exec(UpdateUserById, [{ last_login_time: new Date() }, result.id])
        return result
      } else {
        throw new Error('用户名或密码错误')
      }
    } catch (error) {
      throw error
    }
  }

  static async register(userName: string, password: string, roleId: number) {
    try {
      const userExists = await getOne(CheckUserExistsQuery, [userName])
      if (userExists) {
        throw new Error('用户名已存在')
      }
      const roleName = (await getOne(QueryByRoleId, [roleId]))?.role_name
      if (!roleName) {
        throw new Error('角色不存在')
      }
      const nickname = userName
      const createTime = new Date()
      const updateTime = createTime
      await exec(InsertUserQuery, [
        userName,
        nickname,
        password,
        roleId,
        roleName,
        createTime,
        updateTime
      ])
      return { message: '注册成功' }
    } catch (error) {
      throw error
    }
  }
}

export default UserService
