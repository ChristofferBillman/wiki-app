import mongoose, { Schema, Document } from "mongoose"

export interface IWiki extends Document {
    _id?: string
    description: string
    img?: string
    name: string
}

const wikiSchema: Schema<IWiki> = new Schema({
    description: { type: String, required: true },
    name: {type: String, required: true, maxLength: [64, 'Wiki name cannot be longer than 64 characters.']},
    img: { type: String },
});

export default mongoose.model<IWiki>('Wiki', wikiSchema)