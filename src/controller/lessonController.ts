import lessonService from "../services/lessonService";
import catchAsync from "../helper/catchAsync";
import { uploadToCloudinary } from "../helper/uplaodVideo";
import { sanitizeContent } from "../helper/sanitizeContent";

const lessonController = {
    createLesson: catchAsync(async (req, res) => {
        try {
            const { content, title, description } = req.body;
            const videoFile = req.file;
            const courseId = req.params.courseId;

            let videoUrl;
            if (videoFile) {
                videoUrl = await uploadToCloudinary(videoFile);
            }
            
            const sanitizedContent = sanitizeContent(content);
            const newLesson = await lessonService.createLesson({
                title,
                videoUrl,
                courseId,
                content: sanitizedContent,
                description
            });

            return res.status(201).json({
                message: "Module created successfully",
                data: newLesson,
                lessonId: newLesson.id
            });
        } catch (error) {
            // console.log(error);
            return res.status(500).json({ error });
        }
    }),
    getAllLessons: catchAsync(async (req, res) => {
        try {
            const lessons = await lessonService.getAllLessons();
            if (lessons.length === 0) {
                return res.status(404).json({
                    message: "No lessons found",
                });
            }
            return res.status(200).json({
                message: "All lessons",
                data: lessons,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }),
    getLesson: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const lesson = await lessonService.getLessonById({ id });
            return res.status(200).json({
                message: "Lesson found",
                data: lesson,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }),
    getLessonByCourseId: catchAsync(async (req, res) => {
        try {
            const { courseId } = req.params;
            const lessons = await lessonService.getLessonsByCourseId({ courseId });
            if (lessons.length === 0) {
                return res.status(404).json({
                    message: "No lessons found",
                });
            }
            return res.status(200).json({
                message: "Lessons and sub-lessons found for this course",
                data: lessons,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }),
    deleteLesson: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            await lessonService.deleteLesson({ id });
            return res.status(200).json({
                message: "Lesson deleted successfully",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }),
    updateLesson: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            const lesson = await lessonService.updateLesson({ id }, {
                title,
                content
            });
            return res.status(200).json({
                message: "Lesson updated successfully",
                data: lesson,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }),

}

export default lessonController;
