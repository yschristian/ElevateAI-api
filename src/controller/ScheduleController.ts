import catchAsync from "../helper/catchAsync";
import { Request } from "express";
import scheduleServices from "../services/ScheduleServices";
import moment from 'moment';

interface CustomRequest extends Request {
    user: any;
}

const scheduleController = {
    createSchedule: catchAsync(async (req, res) => {
        try {
            const scheduleData = req.body;
            const userId = (req as CustomRequest).user.id;
            const { title, description, date, time } = scheduleData;
            const dateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm").toDate();
            // console.log("dateTime",dateTime)
            const newSchedule = await scheduleServices.createSchedule({
                title,
                description,
                date: dateTime,
                time,
                user: {
                    connect: {
                        id: userId
                    }
                },
            });
            return res.status(201).json({
                message: "Schedule set successfull",
                data: newSchedule
            });
        } catch (error) {
            console.log(error)
        }
    }),

    getAllSchedules: catchAsync(async (req, res) => {
        try {
            const schedules = await scheduleServices.getAllSchedules();
            return res.status(200).json({
                message: "all schedule",
                data: schedules
            });
        } catch (error) {
            console.log(error)
        }
    }),

    getScheduleById: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const schedule = await scheduleServices.getScheduleById(id);
            if (!schedule) {
                return res.status(404).json({ message: "Schedule not found" });
            } else {
                return res.status(200).json({
                    message: "schedule retrieved",
                    data: schedule
                });
            }
        } catch (error) {
            console.log(error)
        }
    }),

    updateSchedule: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedSchedule = await scheduleServices.updateSchedule(id, updateData);
            return res.status(200).json({
                message: "schedule upadated!",
                data: updatedSchedule
            });
        } catch (error) {
            console.log(error)
        }
    }),

    deleteSchedule: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await scheduleServices.deleteSchedule(id);
            return res.status(204).json({
                message: "schedule deleted",
                data: deleted
            });
        } catch (error) {
            console.log(error)
        }
    }),

    getSchedulesByUserId: catchAsync(async (req, res) => {
        try {
            const userId = (req as CustomRequest).user.id;
            const schedules = await scheduleServices.getSchedulesByUserId(userId);
            return res.status(200).json({
                message: "user schedules retrieved!",
                data: schedules
            });
        } catch (error) {
            console.log(error)
        }
    }),

    deactivateSchedule: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const deactivatedSchedule = await scheduleServices.deactivateSchedule(id);
            return res.status(200).json({
                message: "schedule disactivated",
                data: deactivatedSchedule
            });
        } catch (error) {
            console.log(error)
        }
    }),

    activateSchedule: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const activatedSchedule = await scheduleServices.activateSchedule(id);
            return res.status(200).json({
                message: "schedule disactivated",
                data: activatedSchedule
            });
        } catch (error) {
            console.log(error)
        }
    })
};

export default scheduleController;
