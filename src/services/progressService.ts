import prisma from '../client';
import { Prisma } from '@prisma/client';

export const progressService = {
  // upsertProgress: async (userId: string, courseId: string,progress: number, lessonId?: any, subLessonId?: any) => {
  //   const cappedProgress = Math.min(Math.max(progress, 0), 100);
  //   return prisma.progress.upsert({
  //     where: {
  //       userId_courseId_lessonId_subLessonId: {
  //         userId,
  //         courseId,
  //         lessonId: lessonId || undefined,
  //         subLessonId: subLessonId || undefined,
  //       },
  //     },
  //     update: {
  //       progress: cappedProgress,
  //       completed: cappedProgress >= 100,
  //       lastAccessed: new Date(),
  //     },
  //     create: {
  //       userId,
  //       courseId,
  //       lessonId: lessonId || undefined,
  //       subLessonId: subLessonId || undefined,
  //       progress: cappedProgress,
  //       completed: cappedProgress >= 100,
  //     },
  //   });
  // },

  upsertProgress: async (
    userId: string,
    courseId: string,
    progress: number,
    lessonId?: any,
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

  markLessonComplete: async (userId: string, courseId: string, lessonId?: any,) => {
    return progressService.upsertProgress(userId, courseId, 100, lessonId,);
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

    const courseProgressMap = new Map<string, { totalProgress: number; count: number ,imageUrl: string | null }>();

    courseProgresses.forEach(progress => {
      const courseName = progress.course.title
      const imageUrl = progress.course.imageUrl
      if (!courseProgressMap.has(courseName)) {
        courseProgressMap.set(courseName, { totalProgress: 0, count: 0 ,imageUrl});
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