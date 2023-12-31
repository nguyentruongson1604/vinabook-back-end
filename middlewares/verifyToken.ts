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
        const {userId} = payload;
        req.userId = userId;        
        next();
    } catch (error) {
        // Xử lý lỗi khi xác thực token thất bại
        const err:IError = {
            message: "Unauthorization",
            statusCode : 401
        }
        return next(err);
    }
}