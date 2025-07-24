import authController from '../controller/authController';
import express from 'express';
import verifyEmail from '../middleware/verifyEmail';
import { isLoggedIn } from '../middleware/isLoggedin';
const router = express.Router();

router.post('/signup', authController.signUp)
        .post('/signin', verifyEmail, authController.signIn)
        .post('/forgotpassword', authController.forgotPassword)
        .post('/resetpassword/:token', authController.resetPassword)
        .post('/verifyCode', authController.verifyCode)
        .get('/verify-email/:emailToken', authController.verifyEmail)
        .put("/changepsw", isLoggedIn, authController.changePassword)

export default router;

