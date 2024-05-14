import { Handler } from '../types/types'
import { getOne, getAll, exec } from '../db'
interface PoiQueryParams {
  type?: string
  value?: string
  limit?: number
  page?: number
}
const DEFAULT_LIMIT = 30
export const search: Handler = async (req, res) => {
  try {
    const {
      type = 'committee',
      value = '',
      limit = DEFAULT_LIMIT,
      page = 1
    } = req.query as PoiQueryParams
    const offset = limit * (page - 1)
    console.log(req.query)

    let tableName: string

    switch (type) {
      case 'parking':
        tableName = 'Parking_POI'
        break
      case 'garden':
        tableName = 'GARDEN_POI'
        break
      case 'hospital':
        tableName = 'HOSPITAL_POI'
        break
      case 'company':
        tableName = 'COMPANY_POI'
        break
      case 'busStation':
        tableName = 'TRANSIT_POI'
        break
      default:
        tableName = 'COMMITTEE_POI'
    }

    const countSql = `
      SELECT count(*) as total
      FROM "${tableName}"
      WHERE "NAME" LIKE '%${value}%' 
      LIMIT ${limit}
      OFFSET ${offset}
    `

    const total = (await getOne(countSql)).total

    const dataSql = `
      SELECT * FROM "${tableName}"
      WHERE "NAME" LIKE '%${value}%' 
      ORDER BY "ID"
      LIMIT ${limit}
      OFFSET ${offset}
    `

    const data = await getAll(dataSql)

    res.send({
      code: 200,
      message: 'success',
      result: { total, data }
    })
  } catch (error) {
    res.send({
      code: 201,
      message: 'fail',
      result: error
    })
  }
}
