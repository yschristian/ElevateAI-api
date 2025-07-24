import assessmentController from "../controller/assessmentController";
import express from "express";
import { isLoggedIn,isAdmin } from "../middleware/isLoggedin";

const router = express.Router();

router.post("/create/:courseId", isAdmin, assessmentController.createAss)
    .post("/submit/:courseId", isLoggedIn, assessmentController.submitAssessment)
    .get("/marks", isLoggedIn, assessmentController.getUserMarks)
    .get("/course/:courseId", isLoggedIn, assessmentController.getAssessmentByCourseId)
    .get("/all",isAdmin, assessmentController.getAllAssessment)
    .delete("/delete/:id", isAdmin, assessmentController.deleteAssessment)
    .put("/update/:id", isAdmin, assessmentController.updateAssessment)
    .get("/single/:id", isAdmin, assessmentController.getAssessmentById)
    .get("/fail", isAdmin, assessmentController.getAllFailedUsers)
    .get("/certified", isAdmin, assessmentController.getCertifiedUsersByCourseId)
    .get("/failedByCourse/:courseId", isAdmin, assessmentController.getFailedUsersByCourseId)
    .get("/certifiedByCourse/:courseId", isAdmin, assessmentController.getCertifiedUsersByCourseId)
    .delete("/submitted/:id", isAdmin, assessmentController.deleteAssessmentSubmission)
    .put("/submitted/:id", isAdmin, assessmentController.updateAssessmentSubmission)
    .get("/allSubmitted",isAdmin, assessmentController.getAllSubmittedAssessments)
    .get("/singleSubmitted/:id",isAdmin, assessmentController.getSubmittedAssessmentsById)







export default router;
