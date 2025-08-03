import { Prisma } from "@prisma/client";
import prisma from "../client";
import { createPDF } from "../helper/createPdf";
import { uploadCertificate } from "../helper/uploadCert";
import mailer from "../helper/mail";

const assessmentServices = {
    createAssessment: async (data: any) => {
        const newAssessment = await prisma.assessment.create({
            data: {
                question: data.question,
                options: data.options,
                correctAnswer: data.correctAnswer,
                course: {
                    connect: {
                        id: data.courseId
                    }
                },
                user: {
                    connect: {
                        id: data.userId
                    }
                }
            }
        });
        return newAssessment;
    },
    getAssessmentByCourseId: async (filter: Prisma.AssessmentWhereInput) => {
        const assessment = await prisma.assessment.findMany({
            where: filter,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        });
        return assessment;
    },
    getAllAssessment: async () => {
        const assessments = await prisma.assessment.findMany({
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        });
        return assessments;
    },
    deleteAssessment: async (filter: Prisma.AssessmentWhereUniqueInput) => {
        const deletedAssessment = await prisma.assessment.delete({
            where: filter
        });
        return deletedAssessment;
    },
    updateAssessment: async (filter: Prisma.AssessmentWhereUniqueInput, data: Prisma.AssessmentUpdateInput) => {
        const updatedAssessment = await prisma.assessment.update({
            where: filter,
            data
        });
        return updatedAssessment;
    },
    submitAssessment: async (userId: any, courseId: any, answers: any[], assessments: any[]) => {
        const formattedAnswers = answers.map((ans) => ({
            answer: ans.answer,
            assessmentId: ans.assessmentId
        }))

        const correctAnswersCount = formattedAnswers.filter(ans => {
            const question = assessments.find(a => a.id === ans.assessmentId);
            return question && question.correctAnswer === ans.answer;
        }).length;

        const totalQuestions = assessments.length;
        const totalMarks = correctAnswersCount;
        const percentage = correctAnswersCount > 0 ? (totalMarks / totalQuestions) * 100 : 0;
        const certificationThreshold = 80;

        const isCertified = percentage >= certificationThreshold;
        const submission = await prisma.assessmentSubmission.create({
            data: {
                userId,
                courseId,
                answers: formattedAnswers,
                score: totalMarks,
                percentage: percentage,
                isCorrect: isCertified,
                certified: isCertified,
                assessmentDate: new Date(),
            },
        });

        if (isCertified) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            const course = await prisma.course.findUnique({ where: { id: courseId } });

            const certificateData = {
                firstName: user?.firstName,
                lastName: user?.lastName,
                course: { title: course?.title },
                companyName: "ELEVAIte",
                completionDate: new Date().toLocaleDateString(),
                certificateCode: `CA-${new Date().getFullYear()}-${submission.id}`,
            };
            const pdfBuffer = await createPDF(certificateData);
            const certificateUrl = await uploadCertificate(pdfBuffer, submission.id);

            if (!user || !course) {
                return {
                    error: "User or course not found"
                }
            }
             await prisma.certificate.create({
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
        return submission;
    },
    getUserMarks: async (filter: Prisma.AssessmentSubmissionWhereInput) => {
        const userMarks = await prisma.assessmentSubmission.findFirst({
            where: filter,
            orderBy: [
                { assessmentDate: 'desc' },
            ],
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
            }
        });
        return userMarks;
    },
    getAllCertified: async () => {
        const certifiedUsers = await prisma.assessmentSubmission.findMany({
            where: {
                isCorrect: true,
                certified: true
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
            }
        });
        return certifiedUsers
    },
    getAllFailed: async () => {
        const failedUsers = await prisma.assessmentSubmission.findMany({
            where: {
                isCorrect: false,
                certified: false
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
            }
        });
        return failedUsers
    },
    getAllSubmittedAssessments: async () => {
        const submittedAssessments = await prisma.assessmentSubmission.findMany({
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
            }
        })
        return submittedAssessments
    },
    deleteAssessmentSubmission: async (filter: Prisma.AssessmentSubmissionWhereUniqueInput) => {
        const deletedSubmission = await prisma.assessmentSubmission.delete({
            where: filter
        });
        return deletedSubmission;
    },
    getAssessmentSubmissionById: async (filter: Prisma.AssessmentSubmissionWhereInput) => {
        const submission = await prisma.assessmentSubmission.findFirst({
            where: filter,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
            }
        });
        return submission;
    },
    updateAssessmentSubmission: async (filter: Prisma.AssessmentSubmissionWhereUniqueInput, data: Prisma.AssessmentSubmissionUpdateInput) => {
        const updatedSubmission = await prisma.assessmentSubmission.update({
            where: filter,
            data
        });
        return updatedSubmission;
    },
    getCertifiedUsersByCourseId: async (filter: Prisma.AssessmentSubmissionWhereInput) => {
        const certifiedUsers = await prisma.assessmentSubmission.findMany({
            where: {
                isCorrect: true,
                certified: true,
                courseId: filter.courseId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
            }
        });
        return certifiedUsers;
    },
    getFailedUsersByCourseId: async (filter: Prisma.AssessmentSubmissionWhereInput) => {
        const failedUsers = await prisma.assessmentSubmission.findMany({
            where: {
                isCorrect: false,
                certified: false,
                courseId: filter.courseId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
            }
        });
        return failedUsers;
    }

};

export default assessmentServices;
