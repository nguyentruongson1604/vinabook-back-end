import dotenv from 'dotenv';
dotenv.config();

import connectDB  from './configs/db';
connectDB()

import express from 'express';
import cors from 'cors';

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
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/author', authorRouter)
app.use('/api/v1/publisher', publisherRouter)
app.use('/api/v1/book', bookRouter)
app.use('/api/v1/cart', cartRouter)

const port = process.env.APP_PORT
 
app.listen(port,()=>{
    console.log(`Server is runnning on port ${port}`);
})