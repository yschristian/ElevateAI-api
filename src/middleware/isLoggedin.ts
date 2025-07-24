import { Request } from "express";
import catchAsync from "../helper/catchAsync";
import jwtHelper from "../helper/jwt";

interface JwtPayload {
    role: string;
    id: string;
}

interface CustomRequest extends Request {
    user?: JwtPayload;
    token?: string;
}

export const isAdmin = catchAsync((req: CustomRequest, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = jwtHelper.verify(token) as JwtPayload;
        // if (user.role !== "admin" || "instructor") {
        //     return res.status(401).json({ message: "you don't have access to do this" });
        // }
        req.user = user;
        req.token = token;
        next();  
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
});

export const isLoggedIn = catchAsync((req: CustomRequest, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        const user = jwtHelper.verify(token) as JwtPayload;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
})