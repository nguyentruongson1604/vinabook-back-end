import IError from "../interfaces/error.interface"
import { Response, NextFunction} from 'express'
import { IRequest } from "../interfaces/request.interface"

export const errorHandler = (err: IError, req: IRequest, res: Response, next: NextFunction)=>{
    err.statusCode = err.statusCode || 500

    //duplication: khi dky tk bị trùng gmail,tên...
    if(err.code === 11000){
        err.statusCode = 400
        for(let p in err.keyValue){
            err.message = `${p} have to unique`
        }
    }

    //object ID: not found
    if(err.code === "ObjectId"){
        err.statusCode = 404
        err.message = `the ${req.originalUrl} is not found because of wrong ID`
    }

    //validation
    if(err.errors){
        err.statusCode = 400
        err.message = []
        for(let p in err.errors){
            err.message.push(err.errors[p].properties.message) 
        }
    }

    res.status(err.statusCode).json({
        status: 'fail',
        message: err.message
    })
}