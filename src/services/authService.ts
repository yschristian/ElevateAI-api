import prisma from "../client";
import { encryptPassword, isPasswordMatch } from "../helper/encryption";
import userService from "./userService";
import crypto from 'crypto';

const authServices = {
    isEmailExist: async (email: string) => {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user;
    },

    register: async (data: any) => {
        const newUser = await prisma.user.create({ data });
        return newUser;
    },
    login: async (email: string, password: string) => {
        const user = await userService.getUserByKey({ email });
        if (!user) {
            return null;
        }
        const isMatch = await isPasswordMatch(password, user.password);
        if (!isMatch) {
            return null;
        }
        return user;
    },
    forgotpassword: async (email: string) => {
        const user = await userService.getUserByKey({ email });
        if (!user) {
            return null;
        }
        return user;
    },
    resetPassword: async (id: string, password: string) => {
        const hashedPassword = await encryptPassword(password);
        const user = await prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
        return user;
    },
    generateVerificationCode: () => {
        return crypto.randomBytes(3).toString('hex');
    },
    changePassword: async (id: string, hashedPassword: string) => {
        const user = await prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
        return user;
    },
}

export default authServices;
