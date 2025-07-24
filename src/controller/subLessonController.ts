import catchAsync from "../helper/catchAsync";
import { uploadToCloudinary } from "../helper/uplaodVideo";
import subLessonService from "../services/subLessonService";
import { sanitizeContent } from "../helper/sanitizeContent";

const subLessonController = {
    createSubLesson: catchAsync(async (req, res) => {
        try {
            const { content, title, order,description } = req.body;
            const videoFile = req.file;
            const lessonId = req.params.lessonId;
            let videoUrl;
            
            if (videoFile) {
                videoUrl = await uploadToCloudinary(videoFile);
            }
            const sanitizedContent = sanitizeContent(content);
            const newLesson = await subLessonService.createSubLesson({
                title,
                videoUrl,
                lessonId,
                description,
                content: sanitizedContent,
                order
            });

            return res.status(201).json({
                message: "sub lesson created successfully",
                data: newLesson
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }),
    getAllSubLessons: catchAsync(async (req, res) => {
        try {
            const subLessons = await subLessonService.getAllSubLessons();
            if (subLessons.length === 0) {
                return res.status(404).json({
                    message: "No sub lessons found",
                });
            }
            return res.status(200).json({
                message: "All sub lessons",
                data: subLessons,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }),
    getSubLesson: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const subLesson = await subLessonService.getSubLessonById({ id });
            return res.status(200).json({
                message: "Sub lesson found",
                data: subLesson,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }),
    deleteSubLesson: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const subLesson = await subLessonService.deleteSubLesson({ id });
            return res.status(200).json({
                message: "Sub lesson deleted",
                data: subLesson,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }),
    updateSubLesson: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const { content, title, order } = req.body;
            const subLesson = await subLessonService.updateSubLesson({ id }, {
                content, title, order,
                videoUrl: "",
                lesson: {
                    create: undefined,
                    connectOrCreate: undefined,
                    connect: undefined
                }
            });

            return res.status(200).json({
                message: "Sub lesson updated",
                data: subLesson,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }),

}

export default subLessonController;
