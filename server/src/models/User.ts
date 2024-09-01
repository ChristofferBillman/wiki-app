import mongoose, { Schema } from 'mongoose'

export interface IUser {
    password: string
    name: string
    wikis: string[]
    _id: string
}

const userSchema: Schema = new Schema<IUser>({
    password: { type: String, required: true },
    name: { type: String, required: true, maxlength: [64, 'Username cannot be longer than 64 characters.'] },
    wikis: [{type: String, required: true}]
})

export default mongoose.model('User', userSchema)