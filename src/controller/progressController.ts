import { progressService } from "../services/progressService";
import catchAsync from "../helper/catchAsync";
import { Request, Response } from "express";

interface CustomRequest extends Request {
    user: { id: string };
}

const progressController = {
    upsertProgress: catchAsync(async (req, res) => {
        try {
            const { courseId, lessonId, progress } = req.body;
            const userId = (req as CustomRequest).user.id;
            const result = await progressService.upsertProgress(
                userId,
                courseId,
                progress || 0,
                lessonId || null
            );
            return res.status(200).json({
                message: "Progress updated successfully",
                data: result,
            });
        } catch (error) {
            console.error("Error in upsertProgress:", error);
            return res.status(500).json({ error: "Failed to update progress" });
        }
    }),

    getCourseProgress: catchAsync(async (req, res) => {
        try {
            const { courseId } = req.params;
            const userId = (req as CustomRequest).user.id;
            const progress = await progressService.getCourseProgress(userId, courseId);
            res.status(200).json(progress);
        } catch (error) {
            console.error("Error in getCourseProgress:", error);
            res.status(500).json({ error: "Failed to get course progress" });
        }
    }),

    getUserLatestProgress: catchAsync(async (req, res) => {
        try {
            const userId = (req as CustomRequest).user.id;
            const latestProgress = await progressService.getUserLatestProgress(userId);
            return res.status(200).json({
                message: "User's latest progress",
                data: latestProgress
            });
        } catch (error) {
            console.error("Error in getUserLatestProgress:", error);
            res.status(500).json({ error: "Failed to get user's latest progress" });
        }
    }),

    getOverallCourseProgress: catchAsync(async (req, res) => {
        try {
            const { courseId } = req.params;
            const userId = (req as CustomRequest).user.id;
            const overallProgress = await progressService.getOverallCourseProgress(userId, courseId);
            return res.status(200).json({ overallProgress });
        } catch (error) {
            console.error("Error in getOverallCourseProgress:", error);
            res.status(500).json({ error: "Failed to get overall course progress" });
        }
    }),

    markLessonComplete: catchAsync(async (req, res) => {
        try {
            const { courseId, lessonId } = req.body;
            const userId = (req as CustomRequest).user.id;
            const result = await progressService.markLessonComplete(userId, courseId, lessonId);
            return res.status(200).json({
                message: "Lesson marked as complete",
                data: result,
            });
        } catch (error) {
            console.error("Error in markLessonComplete:", error);
            res.status(500).json({ error: "Failed to mark lesson as complete" });
        }
    }),

    getNextUncompletedLesson: catchAsync(async (req, res) => {
        try {
            const { courseId } = req.params;
            const userId = (req as CustomRequest).user.id;
            const nextLesson = await progressService.getNextUncompletedLesson(userId, courseId);
            if (!nextLesson) return res.status(200).json({ message: "No next lesson found" });
            return res.status(200).json({
                message: "Next uncompleted lesson",
                data: nextLesson,
            });
        } catch (error) {
            console.error("Error in getNextUncompletedLesson:", error);
            res.status(500).json({ error: "Failed to get next uncompleted lesson" });
        }
    }),
    getProgressInEachCourse: catchAsync(async (req, res) => {
        try {
            const courseProgresses = await progressService.getProgressInEachCourse()
            return res.status(200).json({
                message: "Progress in each course",
                data: courseProgresses
            });
        } catch (error) {
            console.log("Error in getProgressInEachCourse:", error);
        }
    })
};

export default progressController;