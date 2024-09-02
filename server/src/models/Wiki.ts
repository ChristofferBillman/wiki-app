import mongoose, { Schema, Document } from 'mongoose'
import { composeMongoose } from 'graphql-compose-mongoose'
import timestamps from 'mongoose-timestamp'

export interface IWiki extends Document {
    _id?: mongoose.Types.ObjectId
    description: string
    img?: string
    name: string
}

const WikiSchema: Schema<IWiki> = new Schema({
    description: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        maxLength: [64, 'Wiki name cannot be longer than 64 characters.']
    },
    img: {
        type: String 
    }
})

WikiSchema.plugin(timestamps)

WikiSchema.index({ createdAt: 1, updatedAt: 1 })

export const Wiki = mongoose.model('Wiki', WikiSchema)
export const WikiTC = composeMongoose(Wiki)