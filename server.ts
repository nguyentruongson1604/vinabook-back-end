import dotenv from 'dotenv';
dotenv.config();

import connectDB  from './configs/db';
connectDB()

import express from 'express';
import cors from 'cors';

import { errorHandler } from './middlewares/errorHandler';
import routerUser from './routes/user.route';
import routerBill from './routes/bill.route';
import categoryRouter from './routes/category.route'
import authorRouter from './routes/author.route'
import publisherRouter from './routes/publisher.route'
import bookRouter from './routes/book.route'
import cartRouter from './routes/cart.route'

const app = express();

//public images folder
app.use('/images', express.static('images'));

app.use(cors())
app.use(express.json())

app.use('/api/user', routerUser)
app.use('/api/bill', routerBill)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/author', authorRouter)
app.use('/api/v1/publisher', publisherRouter)
app.use('/api/v1/book', bookRouter)
app.use('/api/v1/cart', cartRouter)

app.all('*',(req,res,next)=>{
    const err = new Error('The route can not found');
        return next(err);
})
app.use(errorHandler)   
const port = process.env.APP_PORT
 
app.listen(port,()=>{
    console.log(`Server is runnning on port ${port}`);
})