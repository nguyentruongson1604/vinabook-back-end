import express from 'express'
import multer from 'multer'
import { deleteBook, getAllBook, getBookByAuthor, getBookByCategory, getBookById, getBookByPublisher, newBook, searchBooks, updateBook, uploadBookImage } from '../controllers/book.controller';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, './images/books')
    },
    filename: (req: any, file: any, cb: any)=>{
        const bookId = req.params.bookId
        // console.log('name: ', bookId+".jpg")
        cb(null, bookId+".jpg")
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req: any, file: any, cb: any) {
        // console.log("name",file.originalname)
        var ext = path.extname(file.originalname).toLocaleLowerCase();
        // console.log("ext",ext)
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(new Error('Only images are allowed'))
        }
        cb(null, true)
    }
})
const Router = express.Router();

Router.route('/all-book').get(getAllBook);
Router.route('/new-book').post(newBook);
Router.route('/:bookId').get(getBookById).put(updateBook).delete(deleteBook)
Router.route('/:bookId/upload').post(upload.single('image'), uploadBookImage)
Router.route('/author/:authorId').get(getBookByAuthor)
Router.route('/category/:categoryId').get(getBookByCategory)
Router.route('/publisher/:publisherId').get(getBookByPublisher)
Router.route('/all-book/search').get(searchBooks)

export default Router