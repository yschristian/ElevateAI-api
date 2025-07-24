import catchAsync from "../helper/catchAsync";
import { Request } from "express";
import enrollmentService from "../services/enrollmentService";
import jwtHelper from "../helper/jwt";

interface CustomRequest extends Request {
    user: any;
    token?: string;
}

interface JwtPayload {
    role: string;
    id: string;
}


export const checkEnrollment = catchAsync(async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const userId = (req as CustomRequest).user.id;
        const token = req.header("Authorization")?.replace("Bearer ", "");
        const user = jwtHelper.verify(token) as JwtPayload;
        
        if(user.role === "learner"){
             const existingEnrollment = await enrollmentService.existingEnrollment(courseId, userId);
            if (!existingEnrollment) {
                return res.status(400).json({ error: 'you are not enrolled in this course' });
            }
        }
        next();

    } catch (error) {
        return res.status(401).json({ error: "you are not enrolled in this course" });
    }
})
