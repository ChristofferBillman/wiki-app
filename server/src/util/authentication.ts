import { Request, Response } from 'express'
import { UserModel as User, IUser } from '../models/User'
import { randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'

export default class Authentication {
    static TOKEN_DELIMITER = '_'
    /**
     * Checks if a given token on the form [guid].[password hash] is valid.
     */
    static async VerifyToken(token: string): Promise<boolean> {
        const [id, password] = token.split(Authentication.TOKEN_DELIMITER)

        const user: IUser = await User.findOne({ _id: id })

        if (user == null) {
            return false
        }

        return user.password == password
    }
    /**
     * Middleware for express that checks for the presence of a valid token in cookies.
     * If no valid token is found, a 401 (Unauthorized) status is sent.
     * If valid token is found, the id is used to lookup the user, which is added to the request object as req.user.
     * @param req Express request
     * @param res Expess response
     * @param next Express next function
     * @returns void
     */
    static async VerifyTokenAndAddUserToReq(req: Request, res: Response, next) {
        const token = req.cookies.token

        if (token == undefined) {
            res.status(401)
            res.send('Token is missing.')
            return
        }

        const authenticated: boolean = await Authentication.VerifyToken(token)

        if (!authenticated) {
            res.status(401)
            res.send('Invalid token.')
            return
        }
        // Set req.user so that next can use it for authorization.
        const [id, _] = token.split(Authentication.TOKEN_DELIMITER)
        req.user = await User.findById(id)
        next()
    }
    /**
     * Generates a token on the form [guid][DELIMITER][password hash] for a given GUID and password (cleartext).
     * Does checks whether this player exists and if the password provided is correct.
     * @param guid The GUID of the player to generate a token for.
     * @returns A token or Nothing.
     */
    static async GenerateToken(name: string, cleartextPassword: string): Promise<{user: IUser, token: string} | null> {

        // Find a player by name, CASE INSENSITIVE.
        const user: IUser = await User.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } })

        if (user == null || user.password == null) {
            console.log('Tried to generate a token for a non-existent player')
            return null
        }

        const authenticated: boolean = await PassHash.compare(user.password, cleartextPassword)

        if (!authenticated) {
            console.log('Tried to generate a token provided a wrong password.')
            return null
        }

        const hash: string = user.password
        return {user, token: user._id + Authentication.TOKEN_DELIMITER + hash}
    }
}

export class PassHash {
    public static async toHash(password: string): Promise<string> {
        const salt = randomBytes(8).toString('hex');
        const buf = (await promisify(scrypt)(password, salt, 64)) as Buffer;
        return `${buf.toString('hex')}.${salt}`;
    }

    public static async compare(storedPassword: string, suppliedPassword: string): Promise<boolean> {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await promisify(scrypt)(suppliedPassword, salt, 64)) as Buffer;
        return buf.toString('hex') === hashedPassword;
    }
}