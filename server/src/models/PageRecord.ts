import mongoose, { Schema, Document } from 'mongoose'
import { composeMongoose } from 'graphql-compose-mongoose'
import timestamps from 'mongoose-timestamp'

import {IPage} from "./Page"

export interface IPageRecord extends Document {
    page: IPage
    versionNumber: number
    time: number
    author: string
}

const PageRecordSchema: Schema<IPageRecord> = new Schema({
    page: {
        type: Object,
        required: true 
    },
    versionNumber: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    author: {
        type: String,
        required: true
    },
})

PageRecordSchema.plugin(timestamps)
PageRecordSchema.index({ createdAt: 1, updatedAt: 1 })

export const PageRecord = mongoose.model('PageRecord', PageRecordSchema)
export const PageRecordTC = composeMongoose(PageRecord)