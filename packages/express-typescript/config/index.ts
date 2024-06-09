import { PgsqlConfig } from '../types/types'
type DbConfig = {
  debug: boolean
  pgsql: PgsqlConfig
  mysql: any
}
export const dbConfig: DbConfig = {
  debug: true,
  pgsql: {
    host: '10.0.33.82',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'gis',
    //解决时间显示的格式问题
    timezone: 'SYSTEM'
  },
  mysql: {
    host: '47.94.136.113',
    port: '3398',
    user: 'root',
    password: 'gj123456',
    database: 'blog',
    multipleStatements: true,
    waitForConnections: true,
    charset: 'utf8mb4_general_ci'
  }
}
export const jwtConfig = {
  secret: '123456789asdfghjkl!',
  expireTime: '24h'
}
