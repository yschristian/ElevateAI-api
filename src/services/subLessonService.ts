import { Prisma, subLessons } from "@prisma/client";
import prisma from "../client";

const subLessonService = {
    createSubLesson: async (data: any) => {
        const newSubLesson = await prisma.subLessons.create({
            data: {
                title: data.title,
                content: data.content,
                videoUrl: data.videoUrl || null,
                lesson: {
                    connect: {
                        id: data.lessonId
                    }
                },
                order: data.order
            },
        });
        return newSubLesson;
    },
    getAllSubLessons: async () => {
        const subLessons = await prisma.subLessons.findMany({
            orderBy: [
                { createdAt: 'asc' },
            ],
            include: {
                lesson: {
                    select: {
                        id: true,
                        title: true,
                        videoUrl: true,
                        content: true,
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
                        }
                    }
                }
            }
        });
        return subLessons;
    },
    getSubLessonById: async (filter: Prisma.subLessonsWhereInput) => {
        const subLesson = await prisma.subLessons.findFirst({
            where: filter,
            include: {
                lesson: {
                    select: {
                        id: true,
                        title: true,
                        videoUrl: true,
                        content: true,
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
                        }
                    }
                }
            }
        });
        return subLesson;
    },
    deleteSubLesson: async (filter: Prisma.subLessonsWhereUniqueInput) => {
        const deletedSubLesson = await prisma.subLessons.delete({
            where: filter
        });
        return deletedSubLesson
    },
    updateSubLesson: async (filter: Prisma.subLessonsWhereUniqueInput, data: Prisma.subLessonsCreateInput) => {
        const updatedSubLesson = await prisma.subLessons.update({ where: filter, data });
        return updatedSubLesson;
    }
}

export default subLessonService;
