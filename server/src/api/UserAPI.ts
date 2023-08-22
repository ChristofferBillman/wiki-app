import { Request, Response, Application } from 'express'
import { PassHash } from '../PassHash'
import User, { IUser } from '../models/User'

export default function UserAPI(app: Application, BASEURL: string) {
    
    // GET
    app.get(BASEURL + '/', async (req, res) => {
        let user: IUser = await User.findById(req.userId)
    
        user.password = undefined
    
        res.send(JSON.stringify(user))
    })

    // POST 
    // Is located in NoAuthAPI. Everyone can create a user.
    
    // DELETE
    app.delete(BASEURL + '/', async (req, res) => {
        await User.findByIdAndDelete(req.userId).exec()
    })

    // PUT
    // Not implemented
}