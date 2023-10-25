import express from 'express';

import { verifyToken } from "../middlewares/verifyToken";
import checkRole from '../middlewares/checkRole';
import { getAllUser, login, register, getCurrentUser, updateCurrentUser, changePassword, getOtherInfo, updateOtherInfo, deleteOtherInfo, token } from '../controllers/user.controller'


const routerUser = express.Router()

routerUser.route('/register').post(/*validateInputRole,*/ register)
routerUser.route('/login').post(login)

routerUser.route("/getCurrentUser").get(
    verifyToken,
    checkRole('all'),
    getCurrentUser
);
routerUser.route("/updateCurrentUser").put(
    verifyToken,
    checkRole('all'),
//     validateInputRole,
    updateCurrentUser
);

routerUser.route("/getAllUsers").get(
    verifyToken,
    checkRole('admin'),
    getAllUser
);

routerUser.route("/changePassword").put(
    verifyToken,
    checkRole('all'),
    changePassword
);

routerUser.route("/otherUser/:id")
    .get(verifyToken, checkRole('admin'), getOtherInfo)
    .put(verifyToken, checkRole('admin'), updateOtherInfo)
    .delete(verifyToken, checkRole('admin'), deleteOtherInfo);

routerUser.route('/token').post(token)
export default routerUser;