import prisma from '../client';
import { Prisma } from '@prisma/client';
import mailer from '../helper/mail';
import { createPDF } from '../helper/createPdf';
import { uploadCertificate } from '../helper/uploadCert';

export const progressService = {

  upsertProgress: async (
    userId: string,
    courseId: string,
    progress: number,
    lessonId?: any | null,
  ) => {

    const cappedProgress = Math.min(Math.max(progress, 0), 100);

    const where: Prisma.ProgressWhereUniqueInput = {
      userId_courseId_lessonId: {
        userId,
        courseId,
        lessonId: lessonId ?? null,
      },
    };
    const existingProgress = await prisma.progress.findUnique({ where });

    let newProgress = cappedProgress;
    if (existingProgress) {
      newProgress = Math.max(existingProgress.progress ?? 0, cappedProgress);
    }

    const data = {
      progress: newProgress,
      completed: cappedProgress >= 100,
      lastAccessed: new Date(),
    };

    const results = await prisma.progress.upsert({
      where,
      update: data,
      create: {
        ...data,
        userId,
        courseId,
        lessonId: lessonId ?? null,
      },
    });

    if (cappedProgress === 100) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      const id: any = course && course.id;

      const certificateData = {
        firstName: user?.firstName,
        lastName: user?.lastName,
        course: { title: course?.title },
        companyName: "ElevAIte",
        completionDate: new Date().toLocaleDateString(),
        certificateCode: `CA-${new Date().getFullYear()}-${id}`,
      };
      const pdfBuffer = await createPDF(certificateData);
      const certificateUrl = await uploadCertificate(pdfBuffer, id);

      if (!user || !course) {
        return {
          error: "User or course not found"
        }
      }
      const cert = await prisma.certificate.create({
        data: {
          userId: user?.id,
          courseId: course?.id,
          certificateCode: certificateData.certificateCode,
          urlOfCert: certificateUrl,
          createdAt: new Date(),
        },
      });

      await mailer({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        certificate: pdfBuffer as Buffer,
      }, "generateCerticate");

    }

    return results;
  },

  getCourseProgress: async (userId: string, courseId: string) => {
    const progress = await prisma.progress.findMany({
      where: {
        userId,
        courseId,
      },
      include: {
        lesson: true,
      },
      orderBy: {
        lastAccessed: 'desc',
      },
    });

    return progress;
  },

  getUserLatestProgress: async (userId: string) => {
    const latestProgress = await prisma.progress.findMany({
      where: {
        userId,
      },
      include: {
        course: true,
        lesson: true,
      },
      orderBy: {
        lastAccessed: 'desc',
      },
    });

    return latestProgress;
  },

  getOverallCourseProgress: async (userId: string, courseId: string) => {
    const allLessons = await prisma.lesson.count({
      where: { courseId },
    });

    const completedLessons = await prisma.progress.count({
      where: {
        userId,
        courseId,
        completed: true,
      },
    });
    return (completedLessons / allLessons) * 100;
  },

  // In your progress service
  markLessonComplete: async (userId: string, courseId: string, lessonId?: any) => {
    const cappedProgress = 100;

    const where: Prisma.ProgressWhereUniqueInput = {
      userId_courseId_lessonId: {
        userId,
        courseId,
        lessonId: lessonId ?? null,
      },
    };

    const data = {
      progress: cappedProgress,
      completed: true,
      lastAccessed: new Date(),
    };

    // Only update/create progress without certificate generation
    const results = await prisma.progress.upsert({
      where,
      update: data,
      create: {
        ...data,
        userId,
        courseId,
        lessonId: lessonId ?? null,
      },
    });

    console.log('Lesson marked complete:', results);
    // DO NOT generate certificate here - only for course completion
    return results;
  },

  getNextUncompletedLesson: async (userId: string, courseId: string) => {
    const allLessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { createdAt: 'asc' },
      include: { subLessons: true },
    });

    for (const lesson of allLessons) {
      const lessonProgress = await prisma.progress.findFirst({
        where: {
          userId,
          courseId,
          lessonId: lesson.id || null,

        },
      });
      if (!lessonProgress || !lessonProgress.completed) {
        if (lesson.subLessons.length === 0) {
          return { lesson, subLesson: null };
        }

        for (const subLesson of lesson.subLessons) {
          const subLessonProgress = await prisma.progress.findFirst({
            where: {
              userId,
              courseId,
              lessonId: lesson.id || null,
            },
          });

          if (!subLessonProgress || !subLessonProgress.completed) {
            return { lesson, subLesson };
          }
        }
      }
    }

    return null;
  },

  getProgressInEachCourse: async () => {
    const courseProgresses = await prisma.progress.findMany({

      include: {
        course: true
      }

    });

    const courseProgressMap = new Map<string, { totalProgress: number; count: number, imageUrl: string | null }>();

    courseProgresses.forEach(progress => {
      const courseName = progress.course.title
      const imageUrl = progress.course.imageUrl
      if (!courseProgressMap.has(courseName)) {
        courseProgressMap.set(courseName, { totalProgress: 0, count: 0, imageUrl });
      }
      const courseData = courseProgressMap.get(courseName)!;
      courseData.totalProgress += (progress.progress ?? 0);
      courseData.count += 1;
    });

    const averagedProgresses = Array.from(courseProgressMap.entries()).map(([courseName, data]) => ({
      courseName,
      imageUrl: data.imageUrl,
      progressPercentage: Math.round((data.totalProgress / data.count) * 100) / 100,
    }));

    return averagedProgresses;
  },
};