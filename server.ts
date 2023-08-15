import dotenv from 'dotenv';
dotenv.config();

import { connectDB }  from './configs/db';
connectDB()

import express from 'express';
import cors from 'cors';

const app = express();


app.use(cors())
app.use(express.json())

app.get('/',(req,res,next)=>{
    res.status(200).json({
        a: 'a'
    })

})
const port = process.env.APP_PORT
 
app.listen(port,()=>{
    console.log(`Server is runnning on port ${port}`);
})