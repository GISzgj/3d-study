import express from 'express'
import bodyParser from 'body-parser'
import { routes } from './routes'
import cors from 'cors'
const app = express()
const PORT = process.env.PORT || 3000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
routes.forEach(route => {
  const { method, path, middleware, handler } = route
  app[method](path, ...middleware, handler)
})
app.listen(PORT, () => {
  console.log(`Express with Typescript! http://localhost:${PORT}`)
})
