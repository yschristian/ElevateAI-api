import enrollmentController from '../controller/enrollementController';
import express from 'express';
import { isAdmin, isLoggedIn } from '../middleware/isLoggedin';

const router = express.Router();

router.get('/byCourse/:courseId', isAdmin, enrollmentController.getUsersEnrolledBycourse)
    .get('/all', isAdmin, enrollmentController.getAllEnrolled)
    .get('/single/:id', isLoggedIn, enrollmentController.getEnrollrmentById)
    .get('/byUser', isLoggedIn, enrollmentController.getEnrollmentByUserId)
    .put('/update/:id', isAdmin, enrollmentController.updateEnrollment)
    .delete('/delete/:id', isAdmin, enrollmentController.deleteEnrollment)
    .get('/number', isAdmin, enrollmentController.getNumberOfEnrollments);

export default router
