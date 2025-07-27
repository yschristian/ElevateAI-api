import courseController from "../controller/courseController";
import express from "express";
import uploadImage from "../helper/uplaodImage";
import { isAdmin, isLoggedIn } from "../middleware/isLoggedin";

const router = express.Router();

router.post("/create", isLoggedIn, uploadImage.single("imageUrl"), courseController.createCourse)
        .get("/all", courseController.getAllCourses)
        .get("/byType/:courseType", courseController.getCourseByCourseType)
        .get("/free", courseController.getFreeCourses)
        .get("/premium", isLoggedIn, courseController.getPremiumCourses)
        .get("/single/:id", courseController.getCourse)
        .put("/update/:id", isLoggedIn, uploadImage.single("imageUrl"), courseController.updateCourse)
        .delete("/delete/:id", courseController.deleteCourse);

export default router;

