import authServices from "../services/authService";
import { encryptPassword } from "../helper/encryption";
import catchAsync from "../helper/catchAsync";
import jwtHelper from "../helper/jwt";
import mailer from "../helper/mail";
import userService from "../services/userService";
import crypto from "crypto";
import { Request } from "express";
import { isPasswordMatch } from "../helper/encryption";

interface CustomRequest extends Request {
    user: any;
}

interface JwtPayload {
    id: string;
    email: string;
}

const authController = {
    signUp: catchAsync(async (req, res) => {
        try {
            const { email, firstName, lastName, password, role } = req.body;
            const hashedPassword = await encryptPassword(password);
            const emailToken = crypto.randomBytes(16).toString("hex");
            const isExist = await authServices.isEmailExist(email);
            if (isExist) return res.status(200).json({ error: "email already exist" })
            const user = await authServices.register({
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: hashedPassword,
                role: role,
                emailToken: emailToken
            })
            await mailer({ email: user.email, firstName, emailToken }, "Register");
            return res.status(200).json({
                message: "user signup successful",
                data: user
            })
        } catch (error) {
            console.log(error)
        }
    }),
    signIn: catchAsync(async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await authServices.login(email, password);
            if (!user) return res.status(200).json({ error: "invalid credentials" })
            const verificationCode = authServices.generateVerificationCode();
            const verificationCodeExpiry = new Date();
            verificationCodeExpiry.setMinutes(verificationCodeExpiry.getMinutes() + 10);
            await userService.updateUser({ id: user.id }, { verificationCode, verificationCodeExpiry });
            await mailer({ email: user.email, verificationCode, firstName: user.firstName }, "verifyCode");
            return res.status(200).json({
                message: 'Login successful. Verification code sent to email.',
                userId: user.id
            });
        } catch (error) {
            console.log(error)
        }
    }),
    verifyEmail: catchAsync(async (req, res) => {
        try {
            const token = req.params.emailToken;
            const user = await userService.getUserByKey({ emailToken: token });
            if (!user) return res.status(200).json({ error: "user not found" })
            if (user.emailToken !== token) return res.status(200).json({ error: "invalid token" })
            if (user) {
                user.isActivated = true;
                user.emailToken = null;
            }
            await userService.updateUser({ id: user.id }, { emailToken: null, isActivated: true });
            return res.status(200).json({ message: "account is verified" })
        } catch (error) {
            console.log(error)
        }
    }),
    verifyCode: catchAsync(async (req, res) => {
        try {
            const { userId, verificationCode } = req.body;
            const user = await userService.getUserByKey({ id: userId });
            if (!user) return res.status(200).json({ error: "user not found" })
            if (user.verificationCode !== verificationCode) return res.status(200).json({ error: "invalid verification code" })
            if (user.verificationCodeExpiry && user.verificationCodeExpiry < new Date()) {
                return res.status(200).json({ error: 'Verification code has expired, kindly login again!' })
            }
            if (user) {
                user.verificationCode = null
                user.verificationCodeExpiry = null
            }
            await userService.updateUser({ id: user.id }, { verificationCode: null, verificationCodeExpiry: null });
            const data = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
            const token = jwtHelper.sign({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role });
            return res.status(200).json({
                message: 'Verification successful',
                data: data,
                token: token
            })
        } catch (error) {
            console.log(error)
        }
    }),
    forgotPassword: catchAsync(async (req, res) => {
        try {
            const { email } = req.body;
            const user = await authServices.forgotpassword(email);
            if (!user) return res.status(200).json({ message: "user not found" })
            const token = jwtHelper.sign({ id: user.id, email: user.email });
            await mailer({ email: user.email, token }, "forgotPassword");
            return res.status(200).json({ message: "password reset link sent to your email" })
        } catch (error) {
            console.log(error)
        }
    }),
    resetPassword: catchAsync(async (req, res) => {
        try {
            const { password } = req.body;
            const token = req.params.token;
            const decoded = jwtHelper.verify(token) as JwtPayload;
            if (!decoded) return res.status(200).json({ message: "invalid token" })
            const user = await authServices.resetPassword(decoded.id, password);
            if (!user) return res.status(200).json({ message: "user not found" })
            return res.status(200).json({ message: "password reset successful" })
        } catch (error) {
            console.log(error)
        }
    }),
    changePassword: catchAsync(async (req, res) => {
        try {
            const {currentPassword, newPassword} = req.body;
            const userId = (req as CustomRequest).user.id;
            const user = await userService.getUserByKey({ id: userId });
            if (!user) return res.status(200).json({ error: "user not found" })
            const isMatch = await isPasswordMatch(currentPassword, user.password)
            if (!isMatch) return res.status(200).json({ error: "Current password is incorrect" })
            const hashedPassword = await encryptPassword(newPassword)
            await authServices.changePassword(userId, hashedPassword)
            return res.status(200).json({ message: "Password changed successfully" })
        } catch (error) {
            console.log(error)
        }
    }),
}
export default authController;
