import { Prisma } from "@prisma/client";
import prisma from "../client";

type CourseType = "free" | "premium" ;

const courseService = {
    createCourse: async (data: any) => {
        const newCourse = await prisma.course.create({ data });
        return newCourse;
    },
    getAllCourses: async () => {
        const courses = await prisma.course.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    }
                },
                lessons:true,
            }
        });
        return courses;
    },
    getCourseByCourseType: async (courseType: CourseType) => {
        const courses = await prisma.course.findMany({
            where: { courseType },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
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
        });
        return courses;
    },
    getFreeCourses: async () => {
        const courses = await prisma.course.findMany({
            where: { courseType: "free" },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    }
                },
                 lessons:true,
                
            }
        });
        return courses;
    },
    getPrimiumCourses: async () => {
        const courses = await prisma.course.findMany({
            where: { courseType: "premium" },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    }
                },
                 lessons:true,
            }
        });
        return courses;
    },

    getCourseById: async (filter: Prisma.CourseWhereInput) => {
        const course = await prisma.course.findFirst({
            where: filter,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    }
                },
                lessons:true

            }
        });
        return course;
    },
    updateCourse: async (filter: Prisma.CourseWhereUniqueInput, data: Prisma.CourseUpdateInput) => {
        const updatedCourse = await prisma.course.update({ where: filter, data });
        return updatedCourse;
    },
    //  deleteCourse : async (filter: Prisma.CourseWhereUniqueInput) => {
    //     const courseId = filter.id;

    //     // Delete related entities in the correct order
    //      await prisma.lesson.findMany({ where: { courseId } });
    //     await prisma.lesson.deleteMany({ where: { courseId } });
    //     await prisma.assessment.deleteMany({ where: { courseId } });
    //     await prisma.enrollment.deleteMany({ where: { courseId } });
    //     await prisma.progress.deleteMany({ where: { courseId } });
    //     await prisma.certificate.deleteMany({ where: { courseId } });

    //     // Finally, delete the course
    //     const deletedCourse = await prisma.course.delete({ where: { id: courseId } });
    //     return deletedCourse;
    // }

    deleteCourse: async (filter: Prisma.CourseWhereUniqueInput) => {
        // use transaction
        const courseId = filter.id;

        // Delete related entities in the correct order
        await prisma.$transaction([
            prisma.lesson.deleteMany({ where: { courseId } }),
            prisma.assessment.deleteMany({ where: { courseId } }),
            prisma.enrollment.deleteMany({ where: { courseId } }),
            prisma.progress.deleteMany({ where: { courseId } }),
            prisma.certificate.deleteMany({ where: { courseId } }),
        ]);
        // Finally, delete the course   
        const deletedCourse = await prisma.course.delete({ where: filter });
        return deletedCourse;
    }

}

export default courseService;
