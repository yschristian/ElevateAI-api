import userController from "../controller/userController";
import express from 'express';
import { isAdmin, isLoggedIn } from "../middleware/isLoggedin";

const router = express.Router();

router.get('/all', isLoggedIn, userController.getAllUser)
     .get("/profile", isLoggedIn, userController.getUserProfile)
     .get('/single/:id', userController.getOneUser)
     .delete('/delete/:id',isAdmin, userController.deleteUser)
     .put('/update/:id',isLoggedIn, userController.updateUser)


export default router;
