import { IRequest } from './../interfaces/request.interface';
import User from "../models/user.model";
import { Response, NextFunction} from 'express'

const checkRole = (role: string) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            if (req.userId) {                                
                if (role === 'all')
                    next();
                else {     
                    const roleUser = await User.findOne({
                        _id: req.userId,
                    }).select("role");                    
                    if (roleUser?.role && role === roleUser?.role) {
                        next();
                    } else {
                        res.status(401).json({
                            status: "error",
                            message:
                                "You don't have enough permission to perform this action",
                        });
                    }
                }
            }
        } catch (error) {
            console.log('fdsafdsa');
            
            next(error);
        }
    };
};
export default checkRole;
