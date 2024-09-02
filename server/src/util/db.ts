import mongoose, { connect } from 'mongoose'
import 'dotenv/config'

const CONNSTRING = process.env.MONGO_CONNSTRING

export default async function GetDatabaseConnection() {
    if(!CONNSTRING) {
        throw new Error('MONGO_CONNSTRING env var is undefined')
    }
    if (!mongoose.connection.readyState) {
        await connect(CONNSTRING)
    }
    return mongoose.connection
}
