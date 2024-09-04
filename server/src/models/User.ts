import mongoose, { Schema, Document } from 'mongoose'
import createModel from './createmodel'
import { WikiTC } from './Wiki'
import { Role } from '../util/authorization'

export interface IUser extends Document {
    password: string
    name: string
    role: Role
    wikis: mongoose.Types.ObjectId[]
    _id: string
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: [64, 'Username cannot be longer than 64 characters.'] },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    wikis: [{
        type: Schema.Types.ObjectId,
        ref: 'Wiki',
        required: true
    }],
})

const {model, TC} = createModel('User', UserSchema)


TC.addRelation('wikis', {
    resolver: () => WikiTC.mongooseResolvers.findByIds(),
    prepareArgs: {
        _ids: source => source.wikis
    },
    projection: { wikis: true }
})

export const UserModel = model
export const UserTC = TC