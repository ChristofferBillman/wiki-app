import { MongooseError } from "mongoose";

export function MongooseValidationErrorHandler(err, req, res, next) {
    if (err.name === 'ValidationError') {
    
        return res.status(400).send(Object.values(err.errors).reduce((acc, error) => (
            acc + (error as MongooseError).message
        ), ""))
    }
    
    next(err)
}