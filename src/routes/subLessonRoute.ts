import express from "express";
import subLessonController from "../controller/subLessonController";
import { uploadVideo } from "../helper/uplaodVideo";

const router = express.Router();

router.post("/create/:lessonId",uploadVideo.single("videoUrl"), subLessonController.createSubLesson)
        .get("/all", subLessonController.getAllSubLessons)
        .get("/single/:id", subLessonController.getSubLesson)
        .put("/update/:id", subLessonController.updateSubLesson)
        .delete("/delete/:id", subLessonController.deleteSubLesson);

export default router;
