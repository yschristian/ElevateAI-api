import prisma from "../client";
import { Prisma } from "@prisma/client";

const enrollmentService = {
    enrollUser: async (courseId: string, userId: string) => {
        const enrollment = await prisma.enrollment.create({
            data: {
                courseId,
                userId,
                enrollmentDate: new Date()
            }
        });
        return enrollment;
    },
    existingEnrollment: async (courseId: string, userId: string) => {
        const existingEnrollment = await prisma.enrollment.findFirst({
            where: { userId, courseId }
        });
        return existingEnrollment;
    },

    getEnrolledById: async (filter: Prisma.EnrollmentWhereInput) => {
        const enrolledUsers = await prisma.enrollment.findMany({
            where: filter,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                },
                course:true
            }
        })
        return enrolledUsers;
    },
    getAllEnrolled: async () => {
        const allEnrolled = await prisma.enrollment.findMany({
            orderBy: [
                { createdAt: 'desc' },
            ],
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                },
                course:true
            }
        });
        return allEnrolled;
    },
    deleteEnrollment: async (filter: Prisma.EnrollmentWhereUniqueInput) => {
        const deletedEnrollment = await prisma.enrollment.delete({
            where: filter
        });
        return deletedEnrollment
    },
    updateEnrollement: async (filter: Prisma.EnrollmentWhereUniqueInput, data: Prisma.EnrollmentUpdateInput) => {
        const updatedEnrollment = await prisma.enrollment.update({
            where: filter,
            data
        });
        return updatedEnrollment;
    }

}

export default enrollmentService
