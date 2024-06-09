import { createPool, Pool, PoolConnection, RowDataPacket } from 'mysql2/promise'
// import { MysqlConfig } from '../types/types';
import { dbConfig } from '../config/index'

const { debug, mysql }: { debug: boolean; mysql: any } = dbConfig

// 创建连接池
const pool: Pool = createPool(mysql)

async function getOne(sql: string, params: any[] = []): Promise<any | null> {
  const connection: PoolConnection = await pool.getConnection()
  try {
    const [rows]: [RowDataPacket[], any] = await connection.query(sql, params)
    return rows.length !== 0 ? rows[0] : null
  } finally {
    connection.release()
  }
}

async function getAll(sql: string, params: any[] = []): Promise<any[]> {
  const connection: PoolConnection = await pool.getConnection()
  try {
    const [rows]: [RowDataPacket[], any] = await connection.query(sql, params)
    return rows
  } finally {
    connection.release()
  }
}

async function exec(sql: string, params: any[] = []): Promise<any[]> {
  const connection: PoolConnection = await pool.getConnection()
  try {
    const [rows]: [RowDataPacket[], any] = await connection.query(sql, params)
    return rows
  } finally {
    connection.release()
  }
}

export { getOne, getAll, exec }
