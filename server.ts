import dotenv from 'dotenv';
dotenv.config();

import connectDB  from './configs/db';
connectDB()

import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import routerUser from './routes/user.route';
import routerBill from './routes/bill.route';

const app = express();


app.use(cors())
app.use(express.json())
app.use('/api/user', routerUser);
app.use('/api/bill', routerBill);

app.use(errorHandler);

const port = 5000
 
app.listen(port,()=>{
    console.log(`Server is runnning on port ${port}`);
})