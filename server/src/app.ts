import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'
const app = express()
import helmet from 'helmet'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { graphqlHTTP } from 'express-graphql'
import schema from './schema/index'
import GetDatabaseConnection from './util/db'
import Authentication from './util/authentication'

dotenv.config()
app.use(morgan('common'))

app.use(
	helmet({
		contentSecurityPolicy:
			process.env.NODE_ENV === 'production' ? undefined : false,
	})
)

app.use(express.json())
app.use(cookieParser())
//app.use(Authentication.VerifyTokenAndAddUserToReq)

GetDatabaseConnection()

// POST (Login)
app.get('/login', async (req: Request, res: Response) => {
	const name: string = req.query.name as string
	const password: string = req.query.password as string
	
	if (name == undefined || password == undefined) {
		res.status(400)
		res.send('Missing credentials.')
		return
	}

	if (name == '' || password == '') {
		res.status(400)
		res.send('Missing credentials.')
		return
	}

	// Token.Generate authenticates the user.
	const userAndToken = await Authentication.GenerateToken(name, password)

	if (userAndToken == null) {
		res.status(400)
		res.send('Incorrect credentials.')
		return
	}

	const {user, token} = userAndToken

	user.password = undefined
	
	res.cookie('token', token, { sameSite: 'none', secure: true })
	res.status(200).json(user)
})

app.use('/graphql', graphqlHTTP((req: Request) => ({
	 schema,
	 context: {
	   user: req.user,
	 },
	 graphiql: true,
	})
))
	

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Wiki server is running on port ${PORT}`)
})

export default app

