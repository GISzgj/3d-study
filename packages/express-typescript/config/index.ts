import {PgsqlConfig} from '../types/types'
type DbConfig = {
  debug: boolean;
  pgsql: PgsqlConfig;
};
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
  }
}
