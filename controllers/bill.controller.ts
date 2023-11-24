import { IBill, IBooksInBill } from '../interfaces/bill.interface';
import { Response, NextFunction} from 'express'
import { IRequest } from '../interfaces/request.interface';
import { Bill } from '../models/bill.model';
import mongoose from 'mongoose';
import { Book } from '../models/book.model';

//create bill
//for user, admin
export const createUserBill = async(req: IRequest,res: Response,next: NextFunction) => {
  try {
    // lấy userId từ Token
    const userId = new mongoose.Types.ObjectId(req.userId)
        
    const bill: IBill = {
        name: req.body.name,
        phone: req.body.phone,
        books: req.body.books,
        note: req.body.note,
        totalCost: 0,
        status: "wait",
        address: req.body.address,
        owner: userId
    };
    
    const billInfor = await Bill.create(bill)

    const cast: number = billInfor!.books!.reduce(
      (acc: number, currentValue: any) => acc + currentValue.quantity * currentValue.price * ((100-currentValue.discount)/100),
      0
    );
    const payment = await Bill.findByIdAndUpdate({_id: billInfor._id},{totalCost: cast,},{new: true, runValidator: true})    

    res.status(200).json({   
        status: 'success',
        data: payment
    })
  }
  catch (error) {
      next(error);
  }
}


//get all bill order
//for user
export const getAllBillUser = async(req: IRequest,res: Response,next: NextFunction) => {
  try {
    // Lấy thông tin tìm kiếm từ query params
    const { search, page, limit } = req.query;
    
    // Tìm kiếm người dùng dựa trên query
    const filteredBill = await Bill.findOne({ owner: req.userId })
    .populate({
      path: "books.bookId",
      model: Book,
      select: "name"
    })
    .populate('owner', 'name email _id')
    .find({
        $or: [
          { phone: { $regex: search, $options: "i" } },
        ],
    })
    .skip((+page! - 1) * +limit!)
    .limit(+limit!);
    
    res.status(200).json({   
      status: 'success',
      data: filteredBill
    })
  } catch (error) {
    next(error)
  }
};

//get all bill 
//for admin
export const getAllBillAdmin = async(req: IRequest,res: Response,next: NextFunction) => {
  try {
    // Lấy thông tin tìm kiếm từ query params
    const { search, page, limit } = req.query;

    
    // Tìm kiếm người dùng dựa trên query
    const filteredBill = await Bill.find({
        $or: [
          { phone: { $regex: search, $options: "i" } },
        ],
    })
    .skip((+page! - 1) * +limit!)
    .limit(+limit!);

    res.status(200).json({   
      status: 'success',
      data: filteredBill
    })
  } catch (error) {
    next(error)
  }
};

//get info bill
//all
export const getCurrentBill = async(req: IRequest,res: Response,next: NextFunction) =>{
  try {           
    const billInfo = await  Bill.findOne({ _id: req.params.id })    
    .populate({
      path: "books.bookId",
      model: Book,
      select: "name"
    })
    .populate('owner', 'name email _id')

    if (!billInfo) 
      return res.status(400).send("This user doesn't exist");
    res.status(200).json({
        status: "success",
        data: billInfo,
    });
  } catch (error) {
    next(error)
  }
}

//get info bill
//all
export const getCurrentBillUser = async(req: IRequest,res: Response,next: NextFunction) =>{
  try { 
    const userId = new mongoose.Types.ObjectId(req.userId)
    const billInfo = await  Bill.findOne({ _id: req.params.id })
    .populate({
      path: "books.bookId",
      model: Book,
      select: "name"
    })
    .populate('owner', 'name email _id')    
    if (userId.equals(billInfo?.owner?._id || '')){   
      if (!billInfo) 
        return res.status(400).send("This user doesn't exist");
      res.status(200).json({
          status: "success",
          data: billInfo,
      });
    }
    else{
      res.status(200).json({
        status: 'error',
        message: 'You are not the owner'
      });
    }
  } catch (error) {
    next(error)
  }
}

//edit status for bill: admin chuyển trạng thái cho status
//admin
export const updateStatusBill = async(req: IRequest,res: Response,next: NextFunction) =>{
  try {
    const bill = await Bill.findOne({
      _id: req.params.id,
    });
    if (
      (bill?.status === "decline" && req.body.status == "wait") ||
      (bill?.status === "wait" &&
        (req.body.status == "decline" || req.body.status == "accept")))
    {
      const billUpdate = await Bill.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          status: req.body.status,
        },
        {new: true, runValidator: true}
      );
  
      if (billUpdate!.status === "accept") {
        billUpdate!.books!.forEach(async (element) => {
          const bookInfor = await Book.findOne({ _id: element.bookId });
          await Book.findOneAndUpdate(
            {
              _id: element.bookId,
            },
            {
              quantity: +bookInfor!.quantity! - element!.quantity!,
            },
            {new: true, runValidator: true}
          );
        })          
      }
      res.status(200).json({
        status: "success",
        data: billUpdate,
      });
    }
  } catch (error) {
    next(error)
  } 
}

//delete bill
//admin
export const deleteBill = async(req: IRequest,res: Response,next: NextFunction) =>{
  try {
    const bill = await Bill.findOne({_id: req.params.id});            
    if (bill?.status === "decline"){
      await Bill.findByIdAndDelete({_id: req.params.id});
      res.status(200).json({
        status: "success",
      });
    }
    else{
      res.status(200).json({
        status: 'error',
        message: 'Cannot delete bill, check current status again'
      });
    }

  } catch (error) {
    next(error)
  }
}


//delete user bill
//user
export const deleteUserBill = async(req: IRequest,res: Response,next: NextFunction) =>{
  try {
    const userId = new mongoose.Types.ObjectId(req.userId)
    const bill = await Bill.findOne({_id: req.params.id});
    if (userId.equals(bill?.owner || '')){      
      if (bill?.status === "wait"){
        await Bill.findByIdAndDelete({_id: req.params.id});
        res.status(200).json({
          status: "success",
        });
      }
      else{
        res.status(200).json({
          status: 'error',
          message: 'Cannot delete bill, because your order is being shipped'
        });
      }
    }
    else{
      res.status(200).json({
        status: 'error',
        message: "Cannot delete bill, because you are not the owner"
      });
    }

  } catch (error) {
    next(error)
  }
}