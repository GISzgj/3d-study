import express from 'express'
import bodyParser from 'body-parser'
import useRouteMiddleware from './routes/index'
import cors from 'cors'
import helmet from 'helmet'
const app = express()
const PORT = process.env.PORT || 3000
// 采用MVC架构 controllers --- services --- db
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(helmet())
useRouteMiddleware(app)

app.listen(PORT, () => {
  console.log(`Express with Typescript! http://localhost:${PORT}`)
})
