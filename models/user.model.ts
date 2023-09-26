import mongoose, { Schema } from "mongoose"
import { IUser } from "../interfaces/user.interface"
import isEmail from "validator/lib/isEmail"

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: [isEmail, 'Email invalid']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password must be required'], minlength: [6, 'Password must be at 6 characters']    
    },
    role: {
        type: String,
        default: 'user'
    }
})

export const User = mongoose.model<IUser>('User', userSchema)