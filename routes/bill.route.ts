import express from 'express';

import { verifyToken } from "../middlewares/verifyToken";
import checkRole from '../middlewares/checkRole';
import { createUserBill, deleteBill, deleteUserBill, getAllBillAdmin, getAllBillUser, getCurrentBill, getCurrentBillUser, updateStatusBill } from '../controllers/bill.controller';

const routerBill = express.Router()

//create bill
//for user, admin
routerBill.route("/createUserBill").post(
    verifyToken,
    checkRole('all'),
    createUserBill
);

// //update bill: book, adress
// //for user, admin
// routerBill.route("/updateCurrentBill").put(
//     verifyToken,
//     checkRole('all'),
//     updateCurrentBill
// );

//get all bill order
//for user
routerBill.route("/getAllBillUser").get(
    verifyToken,
    checkRole('all'),
    getAllBillUser
);

//get all bill order
//for admin
routerBill.route("/getAllBillAdmin").get(
    verifyToken,
    checkRole('admin'),
    getAllBillAdmin
);

//get info bill
//all
routerBill.route("/getCurrentBill/:id").get(
    verifyToken,
    checkRole('all'),
    getCurrentBill
);

//get info bill user
//user
routerBill.route("/getCurrentBillUser/:id").get(
    verifyToken,
    checkRole('user'),
    getCurrentBillUser
);

//edit status for bill: admin chuyển trạng thái cho status
//admin
routerBill.route("/updateStatusBill/:id").put(
    verifyToken,
    checkRole('admin'),
    updateStatusBill
);

//delete bill
//admin
routerBill.route("/deleteBill/:id").delete(
    verifyToken,
    checkRole('admin'),
    deleteBill
);

//delete bill
//user
routerBill.route("/deleteUserBill/:id").delete(
    verifyToken,
    checkRole('user'),
    deleteUserBill
);
export default routerBill;