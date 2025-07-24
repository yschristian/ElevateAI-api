import userService from "../services/userService";
import catchAsync from "../helper/catchAsync";
import { Request } from "express";

interface CustomRequest extends Request {
    user: any;
}

const userController = {
    getOneUser: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const user = await userService.getUserByKey({ id });
            return res.status(200).json({
                message: "user fetched successfully",
                data: user
            })
        } catch (error) {
            console.log(error)
        }
    }),
    getAllUser: catchAsync(async (req, res) => {
        try {
            const users = await userService.getAllUser();
            return res.status(200).json({
                message: "users fetched successfully",
                data: users
            })
        } catch (error) {
            console.log(error)
        }
    }),
    deleteUser: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const user = await userService.deleteUser({ id });
            return res.status(200).json({
                message: "user deleted successfully",
                data: user
            })
        } catch (error) {
            console.log(error)
        }
    }),
    updateUser: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const user = await userService.updateUser({ id }, req.body);
            return res.status(200).json({
                message: "user updated successfully",
                data: user
            })
        } catch (error) {
            console.log(error)
        }
    }),
    getUserProfile: catchAsync(async (req, res) => {
        try {
            const userId = (req as CustomRequest).user.id;
            const profile = await userService.getUserByKey({ id: userId });
            if (profile) {
                const { password, ...userWithoutPassword } = profile;
                return res.status(200).json({
                    message: "user profile fetched successfully",
                    data: userWithoutPassword
                });
            } else {
                return res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            console.log(error)
        }
    })
}

export default userController
