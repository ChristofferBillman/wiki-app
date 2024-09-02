import mongoose, { Schema, Document, Types } from 'mongoose'
import createModel from './createmodel'

export interface InfoSectionStatistic {
    key: string
    value: string
}

export interface InfoSection {
    data: InfoSectionStatistic[]
}
export interface IPage extends Document {
    content: string
    infoSection: InfoSection
    authors: Types.ObjectId[]
    wikiId: Types.ObjectId
}

const PageSchema: Schema<IPage> = new Schema({
    content: {
        type: String,
        required: true
    },
    infoSection: {
        type: Object,
        required: true
    },
    authors: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    wikiId: {
        type: Schema.Types.ObjectId,
        ref: 'Wiki',
        required: true 
    }
})

export const {model: PageModel, TC: PageTC} = createModel('Page', PageSchema)