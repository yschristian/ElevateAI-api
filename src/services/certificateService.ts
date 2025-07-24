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
        return certificates;
    },
    getCeritificateById: async (filter: Prisma.certificateWhereInput) => {
        const certificates = await prisma.certificate.findMany({
            where: filter,
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
        return certificates;
    },
    deleteCertificate: async (filter: Prisma.certificateWhereUniqueInput) => {
        const certificate = await prisma.certificate.delete({
            where: filter
        });
        return certificate;
    },
    downloadCertificate: async (certificateId: string) => {
        const certificate = await prisma.certificate.findUnique({
            where: { id: certificateId },
            select: { urlOfCert: true }
        });

        if (!certificate) {
            return {
                error: "Certificate not found"
            }
        }
        return certificate.urlOfCert;
    }

}

export default cerficateService;
