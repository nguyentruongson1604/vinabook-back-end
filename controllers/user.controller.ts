import jwt, { JwtPayload } from 'jsonwebtoken';
import { comparePassword, hashPassword } from '../middlewares/comparePassword';
import bcrypt from "bcryptjs";
import { Response, NextFunction} from 'express'
import { IRequest } from '../interfaces/request.interface';
import User from '../models/user.model';
import mongoose from 'mongoose';

//register
export const register = async(req: IRequest,res: Response,next: NextFunction) => {
    try{
        const user = await User.create(req.body)
        res.status(200).json({   
            status: 'success',
        })
    }catch (error){
        next(error)
    }
}

//createOtherInfo
export const createOtherInfo = async(req: IRequest,res: Response,next: NextFunction) => {
    try{
        const user = await User.create(req.body)
        res.status(200).json({   
            status: 'success',
            data: user
        })
    }catch (error){
        next(error)
    }
}

//login
export const login = async (req: IRequest,res: Response,next: NextFunction) => {
    try{
        const user = await User.findOne({email: req.body.email})
        if(!user){
            //err: email ko đúng
            const err = new Error('email is not correct')
            // err.statusCode = 400
            return next(err)    //gửi xuống hàm errorHandler để xử lý
        }
        
        if( user.password)        
            if(bcrypt.compareSync(req.body.password, user.password)){   //nếu pass đúng                
                const accessToken = jwt.sign({userId: user._id}, process.env.APP_SECRET!,{ expiresIn: '10m' } )
                const refreshToken = jwt.sign({userId: user._id}, process.env.APP_SECRET!, { expiresIn: '7d' })
                const response = {
                    status: 'success',
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    data: user,
                }
                res.status(200).json(response)
            }
            else{   //nếu pass sai
                const err = new Error('password is not correct')
                // err.statusCode = 400
                return next(err)    //gửi xuống hàm errorHandler để xử lý
            }
    }catch(error){
        next(error)
    }
    
}

//getAllUser by Admin
export const getAllUser = async (req: IRequest,res: Response,next: NextFunction) => {
    try {
        // Lấy thông tin tìm kiếm từ query params
        const { search, page, limit } = req.query;
        
        // Tìm kiếm người dùng dựa trên query
        const filteredUsers = await User.find({
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
        })
        .skip((+page! - 1) * +limit!)
        .limit(+limit!);
        
        res.status(200).json({   
            status: 'success',
            data: filteredUsers
        })
    } catch (err) {
        next(err)
    }
};

//getCurrentUser by All
export const getCurrentUser = async (req: IRequest,res: Response,next: NextFunction) => {
    try {                
        const user = await  User.findOne({ _id: req.userId });  
        if (!user) return res.status(400).send("This user doesn't exist");
        res.status(200).json({
            status: "success",
            data: user,
        });
    } catch (err) {
        next(err)
    }
}

//updateCurrentUser by All
export const updateCurrentUser = async (req: IRequest,res: Response,next: NextFunction) => {
    try{
        const _id = req.userId;
        const user = await User.findByIdAndUpdate(_id,{...req.body}/*thông tin được update*/,{new: true, runValidator: true}/*phản hồi lại bài post mới*/)
        res.status(200).json({   
            status: 'success',
            data: user
        })
    }catch (error){
        next(error)
    }
}

//getOtherInfo by Admin
export const getOtherInfo = async (req: IRequest,res: Response,next: NextFunction) => {
    try{
        const user = await  User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send("This user doesn't exist");
        res.status(200).json({
            status: "success",
            data: user,
        });
    } catch (err) {
        next(err);
    }
}

//updateOtherInfo by Admin
export const updateOtherInfo = async (req: IRequest,res: Response,next: NextFunction) => {
    try{
        const _id = req.params.id;
        const user = await User.findByIdAndUpdate(_id,{...req.body}/*thông tin được update*/,{new: true, runValidator: true}/*phản hồi lại bài post mới*/)
        res.status(200).json({   
            status: 'success',
            data: user
        })
    }catch (error){
        next(error)
    }
}

//deleteOtherInfo by Admin
export const deleteOtherInfo = async (req: IRequest,res: Response,next: NextFunction) => {
    try{
        const _id = req.params.id;
        const user = await User.findByIdAndDelete({ _id })
        res.status(200).json({   
            status: 'success',
        })
    }catch (error){
        next(error)
    }
}

//changePassword
export const changePassword = async (req: IRequest,res: Response,next: NextFunction) => {
    try{
        const _id = req.userId;        
        const { currentPassword, newPassword } = req.body;        
        const password = await User.findById(_id);  
              
        if (password?.password) {
            const compare = await comparePassword(
                currentPassword,
                password.password,
            );            
            if (compare) {
                const hash = await hashPassword(newPassword);
                const user = await User.findByIdAndUpdate(
                    { _id },
                    { password: hash },
                    {
                        new: true,
                        runValidators: true,
                    },
                );
                
                res.status(200).json({   
                    status: 'success',
                    data: user
                })
            } else {
                const err = new Error('current password is not correct')
                return next(err)  
            }
        } else {
            const err = new Error('current password is not correct')
            return next(err)
        }
    }catch (error){
        next(error)
    }
}

export const token = async (req: IRequest,res: Response,next: NextFunction) =>{
    //refresh the damn token
    const postData = req.body
    const {userId} = jwt.verify(postData.refreshToken, process.env.APP_SECRET!) as JwtPayload
    // if refresh token exists
    if((postData.refreshToken)) {
        const accessToken = jwt.sign({userId: userId}, process.env.APP_SECRET!,{ expiresIn: '10m' } )
        const refreshToken = jwt.sign({userId: userId}, process.env.APP_SECRET!, { expiresIn: '7d' })
        const response = {
            "accessToken": accessToken,
            "refreshToken": refreshToken
        }
        // update the token in the list
        res.status(200).json(response);        
    } else {
        res.status(404).send('Invalid request')
    }
}

