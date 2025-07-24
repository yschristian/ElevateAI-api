import { Prisma } from "@prisma/client";
import prisma from "../client";

const userService = {
    getUserByKey: async (filter: Prisma.UserWhereInput) => {
        const user = await prisma.user.findFirst({ where: filter });
        return user;
    },
    getAllUser: async () => {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })
        if (!users) return []
        return users
    },
    deleteUser: async (filter: Prisma.UserWhereUniqueInput) => {
        const user = await prisma.user.delete({ where: filter })
        return user
    },
    updateUser: async (filter: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput) => {
        const user = await prisma.user.update({ where: filter, data })
        return user
    },
}

export default userService;
