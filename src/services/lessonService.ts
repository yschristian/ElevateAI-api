import { Prisma } from "@prisma/client";
import prisma from "../client";

const lessonService = {
    createLesson: async (data: any) => {
        const newLesson = await prisma.lesson.create({
            data: {
                title: data.title,
                videoUrl: data.videoUrl || null,
                course: {
                    connect: {
                        id: data.courseId
                    }
                },
                content: data.content
            },
        });
        return newLesson;
    },
    
    getAllLessons: async () => {
        const lessons = await prisma.lesson.findMany({
            orderBy: [
                { createdAt: 'asc' },
            ],
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        imageUrl: true,
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                role: true,
                            }
                        }
                    }
                },
                subLessons: {
                    orderBy: [
                        { order: 'asc' },
                        { createdAt: 'asc' },
                    ],
                },
            }
        });
        return lessons;
    },
    getLessonById: async (filter: Prisma.LessonWhereInput) => {
        const lesson = await prisma.lesson.findFirst({
            where: filter,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        imageUrl: true,
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                role: true,
                            }
                        }
                    }
                },
                subLessons: {
                    orderBy: [
                        { order: 'asc' },
                        { createdAt: 'asc' },
                    ],
                }
            }
        });
        return lesson;
    },
    updateLesson: async (filter: Prisma.LessonWhereUniqueInput, data: Prisma.LessonUpdateInput) => {
        const updatedLesson = await prisma.lesson.update({ where: filter, data });
        return updatedLesson;
    },
    deleteLesson: async (filter: Prisma.LessonWhereUniqueInput) => {
        const deletedLesson = await prisma.lesson.delete({ where: filter });
        return deletedLesson;
    },
    getLessonsByCourseId: async (filter: Prisma.LessonWhereInput) => {
        const lessons = await prisma.lesson.findMany({
            where: { ...filter }, 
            orderBy: [
                { createdAt: 'asc' },
            ],
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        imageUrl: true,
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                role: true,
                            }
                        }
                    }
                },
                subLessons: {
                    orderBy: [
                        { order: 'asc' },
                        { createdAt: 'asc' },
                    ],
                },
            }
        });
        return lessons;
    }
}

export default lessonService;