import jwt, {  JwtPayload } from "jsonwebtoken";
import { Response, NextFunction} from 'express'
import { IRequest } from "../interfaces/request.interface";
import IError from "../interfaces/error.interface";
export const verifyToken = (req: IRequest,res: Response,next: NextFunction)=>{
    //lấy quyền truy cập từ req được gắn ở trong header
    const Authorization = req.header('authorization')

    //lấy token

    /* const token = Authorization?.replace('Bearer ','') */
    //**********    TEST
    let accessToken = Authorization?.replace('Bearer ','')   //nhớ ph có cả dấu space
    accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTBjMDJmMDFhYmFlZWYyMjI4M2RkZjgiLCJpYXQiOjE2OTUyODY1NjAsImV4cCI6MTY5NjE1MDU2MH0.a-z7cIvy2yWOEF9D1QNdwMrnP3EDBdhCs8sn2lu6tpA"
    accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTEyNGYzODQ5MDg4ZDg4OTRhZWY4ZjAiLCJpYXQiOjE2OTU2OTg4MzgsImV4cCI6MTcwNDMzODgzOH0.xxUBM9frHvZKfb32m5WQDdM_AFGEp1ESbUL4eSvm-CQ"
    accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOnsidXNlcklkIjoiNjUxMjRmMzg0OTA4OGQ4ODk0YWVmOGYwIiwiaWF0IjoxNjk1NzE2Nzk0LCJleHAiOjE2OTU3MTcwOTR9LCJpYXQiOjE2OTU3MTY4MDIsImV4cCI6MTcwNDM1NjgwMn0.UlDhGJcg4DF3fw4LchZUX0Z3ar8kJogoKfFBt7p7GUI"
    //**********


    if(!accessToken || String(accessToken) === "null"){

        //nếu chưa dnhap, chưa cung cấp token
        const err:IError = {
            message: "Unauthorization",
            statusCode : 401
        }
        
        return next(err)    //gửi xuống hàm errorHandler để xử lý
    }

    //verify
    try {
        const payload = jwt.verify(accessToken, process.env.APP_SECRET!) as JwtPayload;
        const userId = payload.userId;
        req.userId = userId.userId;
        next();
    } catch (error) {
        // Xử lý lỗi khi xác thực token thất bại
        const err = new Error('Token verification failed');
        return next(err);
    }
}