import { Request } from "express";
import enrollmentService from "../services/enrollmentService";
import catchAsync from "../helper/catchAsync";

interface CustomRequest extends Request {
    user: any;
}

const enrollmentController = {
    getAllEnrolled: catchAsync(async (req, res) => {
        try {
            const allEnrolled = await enrollmentService.getAllEnrolled();
            if (allEnrolled.length === 0) {
                return res.status(404).json({ error: 'No enrollments found' });
            }
            return res.status(200).json({ data: allEnrolled });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }),
    getUsersEnrolledBycourse: catchAsync(async (req, res) => {
        try {
            const { courseId } = req.params;
            const enrolledUsers = await enrollmentService.getEnrolledById({ courseId });
            if (enrolledUsers.length === 0) {
                return res.status(404).json({ error: 'No users enrolled in this course yet!' });
            }
            return res.status(200).json({ 
                message: 'Users enrolled in this course',
                data: enrolledUsers
             });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }),
    getEnrollmentByUserId: catchAsync(async (req, res) => {
        try {
            const userId = (req as CustomRequest).user.id;
            const enrollment = await enrollmentService.getEnrolledById({ userId });
            if (!enrollment) {
                return res.status(404).json({ error: 'Enrollment not found' });
            }
            return res.status(200).json({ data: enrollment });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }),

    getEnrollrmentById: catchAsync(async (req, res) => {
        try {
            const { enrollmentId } = req.params;
            const enrollment = await enrollmentService.getEnrolledById({ id: enrollmentId });
            if (!enrollment) {
                return res.status(404).json({ error: 'Enrollment not found' });
            }
            return res.status(200).json({ data: enrollment });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }),

    deleteEnrollment: catchAsync(async (req, res) => {
        try {
            const enrollmentId = req.params.enrollmentId;
            const deletedEnrollment = await enrollmentService.deleteEnrollment({ id: enrollmentId });
            return res.status(200).json({ message: 'Enrollment deleted', data: deletedEnrollment });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }),
    updateEnrollment: catchAsync(async (req, res) => {
        try {
            const enrollmentId = req.params.enrollmentId;
            const data = req.body;
            const updatedEnrollment = await enrollmentService.updateEnrollement({ id: enrollmentId }, data);
            return res.status(200).json({ message: 'Enrollment updated', data: updatedEnrollment });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }),
    getNumberOfEnrollments: catchAsync(async (req, res) => {
        try {
            const allEnrolled = await enrollmentService.getAllEnrolled();
            const count = allEnrolled.length;
            return res.status(200).json({
                message: 'Total number of enrollments',
                data: count
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    })
}

export default enrollmentController;
