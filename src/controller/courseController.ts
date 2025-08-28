import courseService from "../services/courseService";
import catchAsync from "../helper/catchAsync";
import cloudinary from "../helper/cloudImag"
import { Request } from "express";
import { sanitizeContent } from "../helper/sanitizeContent";
import subscribeService from "../services/subscribeService";

interface CustomRequest extends Request {
    user: any;
}

const courseController = {
    createCourse: catchAsync(async (req, res) => {
        try {
            const { title, description, courseType, price } = req.body;
            const result = await cloudinary.uploader.upload(req.file?.path ?? "")
            const userId = (req as CustomRequest).user.id;
            const sanitizedDes = sanitizeContent(description);

            const newCourse = await courseService.createCourse({
                title,
                description: sanitizedDes,
                courseType,
                price,
                imageUrl: result.secure_url,
                userId
            });

            // Automatically notify all subscribers about the new course
            try {
                const notificationResult = await subscribeService.notifyNewCourse(
                    newCourse.title,
                    newCourse.description,
                    newCourse.id
                );
            } catch (emailError) {
                console.error('⚠️ Course created successfully, but failed to notify subscribers:', emailError);
            }
            return res.status(201).json({
                message: "Course created successfully",
                data: newCourse,
            })
        } catch (error: any) {
            console.log("eeee.....", error)
            return res.status(400).json({
                message: "An error occurred, in creating course",
                error: error.message
            })
        }
    }),
    getAllCourses: catchAsync(async (req, res) => {
        try {
            const courses = await courseService.getAllCourses();
            return res.status(200).json({
                message: "All courses",
                data: courses,
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getCourseByCourseType: catchAsync(async (req, res) => {
        try {
            const { courseType } = req.params;
            const courses = await courseService.getCourseByCourseType(courseType);
            if (courses.length === 0) {
                return res.status(404).json({
                    message: "No courses found for this type",
                });
            }
            return res.status(200).json({
                message: `Courses of type ${courseType}`,
                data: courses,
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getFreeCourses: catchAsync(async (req, res) => {
        try {
            const courses = await courseService.getFreeCourses();
            if (courses.length === 0) {
                return res.status(404).json({
                    message: "No free courses found",
                });
            }
            return res.status(200).json({
                message: "All free courses",
                data: courses,
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getPremiumCourses: catchAsync(async (req, res) => {
        try {
            const courses = await courseService.getPrimiumCourses();
            if (courses.length === 0) {
                return res.status(404).json({
                    message: "No premium courses found",
                });
            }
            return res.status(200).json({
                message: "All premium courses",
                data: courses,
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getCourse: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const course = await courseService.getCourseById({ id });
            return res.status(200).json({
                message: "Course found",
                data: course,
            });
        } catch (error) {
            console.log(error)
        }
    }),
    updateCourse: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, price } = req.body;
            const result = await cloudinary.uploader.upload(req.file?.path ?? "")
            const course = await courseService.updateCourse({ id }, {
                title,
                description,
                price,
                imageUrl: result.secure_url
            });
            return res.status(200).json({
                message: "Course updated successfully",
                data: course,
            });
        } catch (error) {
            console.log(error)
        }
    }),

    deleteCourse: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            await courseService.deleteCourse({id});
            return res.status(200).json({
                message: "Course deleted successfully",
            });
        } catch (error) {
            console.log(error)
        }
    }),
}

export default courseController;
