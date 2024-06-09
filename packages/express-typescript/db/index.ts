import { Pool, PoolClient, QueryResult } from 'pg'
import { PgsqlConfig } from '../types/types'
import { dbConfig } from '../config/index'

const { debug, pgsql }: { debug: boolean; pgsql: PgsqlConfig } = dbConfig

// 创建连接池
const pool = new Pool(pgsql)

async function getOne(sql: string, params: any[] = []): Promise<any | null> {
  const client: PoolClient = await pool.connect()
  try {
    const res: QueryResult = await client.query(sql, params)
    return res.rows.length !== 0 ? res.rows[0] : null
  } finally {
    client.release()
  }
}

async function getAll(sql: string, params: any[] = []): Promise<any[]> {
  const client: PoolClient = await pool.connect()
  try {
    const res: QueryResult = await client.query(sql, params)
    return res.rows
  } finally {
    client.release()
  }
}

async function exec(sql: string, params: any[] = []): Promise<any[]> {
  const client: PoolClient = await pool.connect()
  try {
    const res: QueryResult = await client.query(sql, params)
    return res.rows
  } finally {
    client.release()
  }
}

export { getOne, getAll, exec }
