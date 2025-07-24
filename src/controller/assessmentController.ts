import assessmentServices from "../services/assessmentService";
import catchAsync from "../helper/catchAsync";
import { Request } from "express";

interface CustomRequest extends Request {
    user: any;
}

const assessmentController = {
    createAss: catchAsync(async (req, res) => {
        const courseId = req.params.courseId;
        const { question, options, correctAnswer } = req.body;
        const userId = (req as CustomRequest).user.id
        if (!courseId) return res.status(400).json({ message: "CourseId is required", });
        const newAssessment = await assessmentServices.createAssessment({
            question,
            options,
            correctAnswer,
            courseId,
            userId
        });
        return res.status(201).json({
            message: "Assessment created successfully",
            data: newAssessment
        });
    }),
    submitAssessment: catchAsync(async (req, res) => {
        try {
            const { courseId } = req.params
            const { answers } = req.body;
            const userId = (req as CustomRequest).user.id
            const assessments = await assessmentServices.getAssessmentByCourseId({ courseId });
            if (!assessments) return res.status(404).json({ error: "No assessments found for this course", });
            const submittedAssessment = await assessmentServices.submitAssessment(userId, courseId, answers, assessments);
            return res.status(200).json({
                message: "Assessment submitted successfully",
                data: submittedAssessment
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getUserMarks: catchAsync(async (req, res) => {
        try {
            const userId = (req as CustomRequest).user.id;
            const usermarks = await assessmentServices.getUserMarks({ userId });
            return res.status(200).json({
                message: "User marks fetched successfully",
                data: usermarks
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getAssessmentById: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const assessment = await assessmentServices.getAssessmentByCourseId({ id });
            return res.status(200).json({
                message: "Assessment fetched successfully",
                data: assessment
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getAssessmentByCourseId: catchAsync(async (req, res) => {
        try {
            const { courseId } = req.params;
            const assessments = await assessmentServices.getAssessmentByCourseId({ courseId });
            if (assessments.length === 0) return res.status(404).json({ error: "No assessments found for this course", });
            return res.status(200).json({
                message: "Assessments fetched successfully",
                data: assessments
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getAllAssessment: catchAsync(async (req, res) => {
        try {
            const assessments = await assessmentServices.getAllAssessment();
            return res.status(200).json({
                message: "All assessments fetched successfully",
                data: assessments
            });
        } catch (error) {
            console.log(error)
        }
    }),
    deleteAssessment: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const deletedAssessment = await assessmentServices.deleteAssessment({ id });
            return res.status(200).json({
                message: "Assessment deleted successfully",
                data: deletedAssessment
            });
        } catch (error) {
            console.log(error)
        }
    }),
    updateAssessment: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const { question, options, correctAnswer } = req.body;
            const updatedAssessment = await assessmentServices.updateAssessment(
                { id },
                { question, options, correctAnswer });
            return res.status(200).json({
                message: "Assessment updated successfully",
                data: updatedAssessment
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getAllCertifiedUsers: catchAsync(async (req, res) => {
        try {
            const certifiedUsers = await assessmentServices.getAllCertified();
            return res.status(200).json({
                message: "All certified users fetched successfully",
                data: certifiedUsers
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getCertifiedUsersByCourseId: catchAsync(async (req, res) => {
        try {
            const { courseId } = req.params;
            const certifiedUsers = await assessmentServices.getCertifiedUsersByCourseId({ courseId });
            return res.status(200).json({
                message: "Certified users fetched successfully",
                data: certifiedUsers
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getAllFailedUsers: catchAsync(async (req, res) => {
        try {
            const failedUsers = await assessmentServices.getAllFailed();
            return res.status(200).json({
                message: "All failed users fetched successfully",
                data: failedUsers
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getFailedUsersByCourseId: catchAsync(async (req, res) => {
        try {
            const { courseId } = req.params;
            const failedUsers = await assessmentServices.getFailedUsersByCourseId({ courseId });
            return res.status(200).json({
                message: "Failed users fetched successfully",
                data: failedUsers
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getAllSubmittedAssessments: catchAsync(async (req, res) => {
        try {
            const submittedAssessments = await assessmentServices.getAllSubmittedAssessments();
            return res.status(200).json({
                message: "All submitted assessments fetched successfully",
                data: submittedAssessments
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getSubmittedAssessmentsById: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const submittedAssessments = await assessmentServices.getAssessmentSubmissionById({ id });
            return res.status(200).json({
                message: "Submitted assessments fetched successfully",
                data: submittedAssessments
            });
        } catch (error) {
            console.log(error)
        }
    }),
    deleteAssessmentSubmission: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const deletedSubmission = await assessmentServices.deleteAssessmentSubmission({ id });
            return res.status(200).json({
                message: "Assessment submission deleted successfully",
                data: deletedSubmission
            });
        } catch (error) {
            console.log(error)
        }
    }),
    updateAssessmentSubmission: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const { score } = req.body;
            const updatedSubmission = await assessmentServices.updateAssessmentSubmission(
                { id },
                { score });
            return res.status(200).json({
                message: "Assessment submission updated successfully",
                data: updatedSubmission
            });
        } catch (error) {
            console.log(error)
        }
    }),
};

export default assessmentController;