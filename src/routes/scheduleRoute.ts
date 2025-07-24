import scheduleController from "../controller/ScheduleController";
import express from "express";
import { isLoggedIn } from "../middleware/isLoggedin";
const router = express.Router();

router.post("/create", isLoggedIn, scheduleController.createSchedule)
    .get("/all", isLoggedIn, scheduleController.getAllSchedules)
    .get("/byUser", isLoggedIn, scheduleController.getSchedulesByUserId)
    .put("/deactivate/:id", isLoggedIn, scheduleController.deactivateSchedule)
    .put("/activate/:id", isLoggedIn, scheduleController.activateSchedule)
    .get("/:id", isLoggedIn, scheduleController.getScheduleById)
    .put("/update/:id", isLoggedIn, scheduleController.updateSchedule)
    .delete("/delete/:id", isLoggedIn, scheduleController.deleteSchedule)

export default router;
