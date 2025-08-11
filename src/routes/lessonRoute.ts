import lessonController from "../controller/lessonController";
import express from "express";
import { uploadVideo } from "../helper/uplaodVideo";
import { isAdmin, isLoggedIn } from "../middleware/isLoggedin";
import { checkEnrollment } from "../middleware/checkEnrollemnts";

const router = express.Router();

router.post("/create/:courseId", uploadVideo.single("videoUrl"), lessonController.createLesson)
        .get("/all", lessonController.getAllLessons)
        .get("/single/:id", lessonController.getLesson)
        .get("/byCourse/:courseId", lessonController.getLessonByCourseId)
        .put("/update/:id", lessonController.updateLesson)
        .delete("/delete/:id", lessonController.deleteLesson)

export default router;
