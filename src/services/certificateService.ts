import prisma from "../client";
import { Prisma } from "@prisma/client";

const cerficateService = {
    getAllCertificates: async () => {
        const certificates = await prisma.certificate.findMany({
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                course: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true
                    }
                }
            }
        });

        const uniqueCertificates = [];
        const seen = new Set();

        for (const cert of certificates) {
            const key = `${cert.userId}-${cert.courseId}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueCertificates.push(cert);
            }
        }

        return uniqueCertificates;
    },
    getCeritificateById: async (filter: Prisma.certificateWhereInput) => {
        const certificates = await prisma.certificate.findMany({
            where: filter,
            distinct: ['userId', 'courseId'],
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                course: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true
                    }
                }
            }
        });
        const uniqueCertificates = [];
        const seen = new Set();

        for (const cert of certificates) {
            const key = `${cert.userId}-${cert.courseId}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueCertificates.push(cert);
            }
        }

        return uniqueCertificates;

    },
    deleteCertificate: async (filter: Prisma.certificateWhereUniqueInput) => {
        const certificate = await prisma.certificate.delete({
            where: filter
        });
        return certificate;
    },
    downloadCertificate: async (certificateId: string) => {
        try {
            const certificate = await prisma.certificate.findUnique({
                where: { id: certificateId },
                select: { urlOfCert: true }
            });

            if (!certificate) {
                return {
                    error: "Certificate not found"
                }
            }

            return {
                success: true,
                url: certificate.urlOfCert
            };
        } catch (error) {
            return {
                error: "Database error occurred"
            }
        }
    }

}

export default cerficateService;
