import mongoose, { Schema, Document, Model } from 'mongoose'
import { composeMongoose, ObjectTypeComposerWithMongooseResolvers } from 'graphql-compose-mongoose'
import timestamps from 'mongoose-timestamp'

export default function createModel<T extends Document>(modelName: string, schema: Schema<T>): { model: Model<T>, TC: ObjectTypeComposerWithMongooseResolvers<T, any> } {
    schema.plugin(timestamps)
    schema.index({ createdAt: 1, updatedAt: 1 })

    const model: Model<T> = mongoose.model<T>(modelName, schema)
    const TC = composeMongoose(model)

    return { model, TC }
}