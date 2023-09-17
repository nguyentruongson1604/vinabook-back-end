
import mongoose, { ConnectOptions } from 'mongoose';

const connectDatabase = async () => {
    try {
        if(process.env.DB_URI){
            const conn = await mongoose.connect(process.env.DB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            } as ConnectOptions);
            console.log("DB connected");
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDatabase;