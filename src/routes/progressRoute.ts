import express from 'express';
import progressController from "../controller/progressController";
import { isAdmin, isLoggedIn } from '../middleware/isLoggedin';

const router = express.Router();

router.post('/upsert', isLoggedIn, progressController.upsertProgress)
    .get('/latest', isLoggedIn, progressController.getUserLatestProgress)
    .post('/complete', isLoggedIn, progressController.markLessonComplete)
    .get('/course-progress', isLoggedIn, progressController.getProgressInEachCourse)
    .get('/:courseId', isLoggedIn, progressController.getCourseProgress)
    .get('/overall/:courseId', isLoggedIn, progressController.getOverallCourseProgress)
    .get('/next/:courseId', isLoggedIn, progressController.getNextUncompletedLesson)


export default router;