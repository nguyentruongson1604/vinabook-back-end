import mongoose from 'mongoose'
export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1/vinabook');
        console.log('DB connect success!');
    } catch (error) {
        console.log(error);
        process.exit(1)
        
    }
}
