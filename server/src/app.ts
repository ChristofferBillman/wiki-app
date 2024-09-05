import express, { Request } from 'express'
import cookieParser from 'cookie-parser'

const app = express()

import helmet from 'helmet'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { graphqlHTTP } from 'express-graphql'
import playground from 'graphql-playground-middleware-express'
import schema from './schema/index'
import GetDatabaseConnection from './util/db'
import Authentication from './util/authentication'
import FileAPI from './fileuploadAPI'
import path from 'path'

dotenv.config()
app.use(morgan('common'))

app.use(
	helmet({
		contentSecurityPolicy: 
            process.env.NODE_ENV == 'production' ? undefined : false,
	})
)

app.use(express.json())
app.use(cookieParser())
app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')))

GetDatabaseConnection()

app.get('/playground', playground({ endpoint: '/graphql' }))

// Adds user to req.user.
app.use(Authentication.Authenticate)

FileAPI(app)

app.use('/graphql', graphqlHTTP((req: Request) => ({
	 schema,
	 context: {
	   user: req.user,
	 },
	 graphiql: false,
	})
))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Wiki server is running on port ${PORT}`)
})

app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'))
})

export default app

