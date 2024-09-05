import { IUser, UserTC, UserModel as User } from '../models/User'
import Authentication from '../util/authentication'
import Authorization from '../util/authorization'
import { PassHash } from '../util/authentication'

interface LoginArgs {
    name: string
    password: string
}
const login = UserTC.schemaComposer.createResolver<unknown, LoginArgs>({
    name: 'login',
    kind: 'query',
    args: {
        name: 'String!',
        password: 'String!'
    },
    type: `type LoginPayload {
        token: String!
        user: User!
    }`,
    resolve: async ({ args }) => {
        const { name, password } = args

        if (name == undefined || password == undefined) {
            throw new Error('Missing credentials.')
        }

        if (name == '' || password == '') {
            throw new Error('Missing credentials.')
        }
    
        const userAndToken = await Authentication.GenerateToken(name, password)
    
        if (userAndToken == null) {
            throw new Error('Incorrect credentials.')
        }

        const {user, token} = userAndToken

        user.password = undefined
        delete user.password
        
        return {
            token,
            user
        }
    }
})

const userSelf = UserTC.schemaComposer.createResolver<unknown, {}>({
    name: 'userSelf',
    kind: 'query',
    type: `type UserPayload {
        user: User
    }`,
    resolve: async ({ context }) => {
        const { user } = context
        Authorization.assertIsLoggedIn(context)
        removePassword(user)
        console.log(user)
        return { user }
    }
})

interface UserByIdArgs {
   _id: string
}
const userById = UserTC.schemaComposer.createResolver<unknown, UserByIdArgs>({
    name: 'userById',
    kind: 'query',
    args: {
        _id: 'String!',
    },
    type: `type UserPayload {
        user: User
    }`,
    resolve: async ({ context, args }) => {
        Authorization.assertIsLoggedIn(context)
        const user = await User.findById(args._id)
        removePassword(user)
        return { user }
    }
})

interface UsersByNameArgs {
    name: string
 }
const usersByName = UserTC.schemaComposer.createResolver<unknown, UsersByNameArgs>({
    name: 'userSearch',
    kind: 'query',
    args: {
        name: 'String!',
    },
    type: `type UserSearchPayload {
        users: [User!]!
    }`,
    resolve: async ({ context, args }) => {
        Authorization.assertIsLoggedIn(context)
        const users = await User.find({name:{ $regex: args.name, $options: 'i'}}, 'name _id').exec()
        users.forEach(removePassword)
        return { users }
    }
})

const removeSelf = UserTC.schemaComposer.createResolver<unknown, {}>({
    name: 'removeSelf',
    kind: 'mutation',
    type: `type UserPayload {
        user: User
    }`,
    resolve: async ({ context }) => {
        Authorization.assertIsLoggedIn(context)
        const removedUser = await User.findByIdAndDelete(context.user._id).exec()
        removePassword(removedUser)
        return { user: removedUser }
    }
})

interface UpdateNameArgs {
    name: string
 }
const updateName = UserTC.schemaComposer.createResolver<unknown, UpdateNameArgs>({
    name: 'updateName',
    kind: 'mutation',
    args: {
        name: 'String!',
    },
    type: `type UserPayload {
        user: User
    }`,
    resolve: async ({ context, args }) => {
        Authorization.assertIsLoggedIn(context)
        assertLacksWhitespace(args.name, 'Username cannot contain whitespace.')
        await assertNameNotTaken(args.name)

        const updatedUser: IUser | null = await User.findByIdAndUpdate(
            context.user._id,
            { name: args.name },
            { new: true }
        )

        removePassword(updatedUser)

        return { user: updatedUser }
    }
})

interface UpdatePasswordArgs {
    password: string
 }
const updatePassword = UserTC.schemaComposer.createResolver<unknown, UpdatePasswordArgs>({
    name: 'updatePassword',
    kind: 'mutation',
    args: {
        password: 'String!',
    },
    type: `type UpdatePasswordPayload {
        token: String
        user: User
    }`,
    resolve: async ({ context, args }) => {
        Authorization.assertIsLoggedIn(context)

        if(!args.password) {
            throw new Error('Must provide argument "password"')
        }

        assertLacksWhitespace(args.password, 'Password cannot contain whitespace or be empty.')
    
        const hash = await PassHash.toHash(args.password)

        const updatedUser: IUser | null = await User.findByIdAndUpdate(
            context.user._id,
            { password: hash },
            { new: true }
        )

        removePassword(updatedUser)
        
        return {
            token: context.user._id + Authentication.TOKEN_DELIMITER + hash,
            user: updatedUser
        }
    }
})

interface CreateUserArgs {
    name: string
    password: string
 }
const createUser = UserTC.schemaComposer.createResolver<unknown, CreateUserArgs>({
    name: 'createUser',
    kind: 'mutation',
    args: {
        name: 'String!',
        password: 'String!'
    },
    type: `type CreateUserPayload {
        token: String
        user: User
    }`,
    resolve: async ({ args }) => {

        if(!args.password) {
            throw new Error('Must provide argument "password"')
        }

        if(!args.name) {
            throw new Error('Must provide argument "name"')
        }

        assertLacksWhitespace(args.name, 'Username cannot contain whitespace or be empty.')
        assertLacksWhitespace(args.password, 'Password cannot contain whitespace or be empty.')
    
        await assertNameNotTaken(args.name)

        const hash = await PassHash.toHash(args.password)
        
        const wikis = []
        await new User({name: args.name, wikis, password: hash}).save()
            
        const { user, token } = await Authentication.GenerateToken(args.name, args.password)

        removePassword(user)
        
        return {
            token,
            user,
        }
    }
})


let UserQuery = {
    login,
    userSelf,
    userById,
    usersByName
}

let UserMutation = {
    removeSelf,
    updateName,
    updatePassword,
    createUser
}


export { UserQuery, UserMutation }

export function removePassword(user: IUser) {
    user.password = undefined
    delete user.password
}

function assertLacksWhitespace(str: string, errorMsg: string) {
    if(!(str.indexOf(' ') === -1 && str !== '')) {
        throw new Error(errorMsg)
    }
}

async function assertNameNotTaken(name: string) {
    const existingUser = await User.findOne({ name })

    if(existingUser != null) {
        throw new Error(`Username "${name}" is taken.`)
    }
}