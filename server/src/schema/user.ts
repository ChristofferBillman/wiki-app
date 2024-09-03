import { UserTC } from '../models/User'
import Authentication from '../util/authentication'
import Authorization, { AuthRules } from '../util/authorization'

export interface ResolverCollection {
    [key: string]: any
}

const rules: AuthRules = {
    admin: { allowAll: true },
    user: {
        query: true,
        // Can only mutate user if it is the user itself that is doing it.
        mutate: rp => rp.context.user._id.toString() === rp.args.record._id.toString(),
    },
    public: {
        query: false,
        mutate: false
    }
}

const UserQuery: ResolverCollection = {
    userById: UserTC.mongooseResolvers.findById(),
    userByIds: UserTC.mongooseResolvers.findByIds(),
    userOne: UserTC.mongooseResolvers.findOne(),
    userMany: UserTC.mongooseResolvers.findMany(),
    userCount: UserTC.mongooseResolvers.count(),
}

let UserMutation: ResolverCollection = {
    userUpdateById: UserTC.mongooseResolvers.updateById(),
    userUpdateOne: UserTC.mongooseResolvers.updateOne(),
    userRemoveById: UserTC.mongooseResolvers.removeById(),
}

interface LoginArgs {
    name: string
    password: string
}

const loginResolver = UserTC.schemaComposer.createResolver<unknown, LoginArgs>({
    name: 'login',
    kind: 'mutation',
    args: {
        name: 'String!',
        password: 'String!'
    },
    type: `type LoginPayload {
        token: String
        user: User
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

Authorization.bulkApplyAuthRules(UserQuery, rules)
Authorization.bulkApplyAuthRules(UserMutation, rules)

// Add login here so it does not have the same auth rules.
UserMutation = {
    ...UserMutation,
    login: loginResolver
}

export { UserQuery, UserMutation }