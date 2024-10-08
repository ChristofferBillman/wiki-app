import GetDatabaseConnection from './Database'
import cookieParser from 'cookie-parser'
import path from 'path'

import express, { Request, Response, Application } from 'express'
import Token from './Token'
import UserAPI from './api/UserAPI'
import NoAuthAPI from './api/NoAuthAPI'
import PageAPI from './api/PageAPI'
import PageHistoryAPI from './api/PageHistoryAPI'
import SearchAPI from './api/SearchAPI'
import WikiAPI from './api/WikiAPI'
import FileAPI from './api/FileAPI'
import { MongooseValidationErrorHandler } from './middleware/Validation'

GetDatabaseConnection()

const app: Application = express()
const port = process.env.PORT || 3000
const BASEURL = '/api'

app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')))
app.use(express.static("public"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(port, () => console.log(`Wiki server is running on port ${port}`))

app.get(BASEURL + '/test', (req: Request, res: Response) => res.send('Hello: ' + req.query.name))

NoAuthAPI(app, BASEURL)

// cookieParser is run before Token.VerifyMiddleware
// because it depends on the cookies being parsed.
app.use(cookieParser())
// This middleware will be invoked on all following routes.
// All following routes will require a valid token.
app.use(Token.VerifyAndAddIdToReq)

UserAPI(app, BASEURL + '/user')
PageAPI(app, BASEURL + '/page')
PageHistoryAPI(app, BASEURL + '/page/history')
SearchAPI(app, BASEURL)
WikiAPI(app, BASEURL + '/wiki')
FileAPI(app, BASEURL)

app.use(MongooseValidationErrorHandler)

app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'))
})

export default app

