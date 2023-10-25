import jwt, {  JwtPayload } from "jsonwebtoken";
import { Response, NextFunction} from 'express'
import { IRequest } from "../interfaces/request.interface";
import IError from "../interfaces/error.interface";
export const verifyToken = (req: IRequest,res: Response,next: NextFunction)=>{
    //lấy quyền truy cập từ req được gắn ở trong header
    const Authorization = req.header('authorization')
    // console.log(Authorization)
    //lấy token
    const accessToken = Authorization?.replace('Bearer ','')   //nhớ ph có cả dấu space

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
        req.userId = userId;
        // console.log("userId", userId)
        next();
    } catch (error) {
        // Xử lý lỗi khi xác thực token thất bại
        const err = new Error('Token verification failed');
        return next(err);
    }
}