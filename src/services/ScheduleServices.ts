import { Prisma } from "@prisma/client";
import prisma from "../client";

const scheduleServices = {
    createSchedule: async (data: Prisma.ScheduleCreateInput) => {
        const schedule = await prisma.schedule.create({
            data,
        });
        return schedule;
    },
    getAllSchedules: async () => {
        const allSchedule = await prisma.schedule.findMany({
            include:{
                user:true
            }
        });
        return allSchedule;
    },

    getScheduleById: async (id: string) => {
        return await prisma.schedule.findUnique({
            where: { id },
        });
    },

    updateSchedule: async (id: string, data: Prisma.ScheduleUpdateInput) => {
        const updatedSchedule = await prisma.schedule.update({
            where: { id },
            data,
        });
        return updatedSchedule;
    },

    deleteSchedule: async (id: string) => {
        const deletedSch = await prisma.schedule.delete({
            where: { id },
        });
        return deletedSch;
    },

    getSchedulesByUserId: async (userId: string) => {
        const userSchedule = await prisma.schedule.findMany({
            where: { userId },
            orderBy:{
                date:"asc"
            }
        });
        return userSchedule;
    },
    
    deactivateSchedule: async (id: string) => {
        const deactivatedSchedule = await prisma.schedule.update({
            where: { id },
            data: {
                active: false,
            },
        });
        return deactivatedSchedule;
    },

    activateSchedule: async (id: string) => {
        const activatedSchedule = await prisma.schedule.update({
            where: { id },
            data: {
                active: true,
            },
        });
        return activatedSchedule;
    }
};

export default scheduleServices;
