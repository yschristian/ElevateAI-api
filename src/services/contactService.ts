import { Prisma } from "@prisma/client";
import prisma from "../client";

const contactService = {
     createContact: async (data: any) => {
        const newCourse = await prisma.contact.create({ data });
        return newCourse;
    },
    getAllContact: async () => {
        return await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' }
        });
    },

    getById: async (filter:Prisma.contactWhereInput) => {
        return await prisma.contact.findFirst({
            where:filter
        });
    },

    deleteContact: async (filter: Prisma.contactWhereUniqueInput) => {
        const user = await prisma.contact.delete({ where: filter })
        return user
    },

}

export default contactService
