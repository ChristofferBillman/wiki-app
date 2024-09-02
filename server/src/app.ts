import express from 'express'
const app = express()
import helmet from 'helmet'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { graphqlHTTP } from 'express-graphql'
import schema from './schema/index'
import GetDatabaseConnection from './util/db'

dotenv.config()
app.use(morgan('common'))

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === 'production' ? undefined : false,
  })
)

app.use(express.json())

GetDatabaseConnection()

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Wiki server is running on port ${PORT}`)
})

export default app

