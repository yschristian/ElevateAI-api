import { Prisma } from "@prisma/client";
import prisma from "../client";


const blogService = {
    createblog: async (data: any) => {
        const newblog = await prisma.blog.create({ data });
        return newblog;
    },
    getAllblogs: async () => {
        const blogs = await prisma.blog.findMany({
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
        return blogs;
    },
 
    getblogById: async (filter: Prisma.blogWhereInput) => {
        const blog = await prisma.blog.findFirst({
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
                }

            }
        });
        return blog;
    },
    updateblog: async (filter: Prisma.blogWhereUniqueInput, data: Prisma.blogUpdateInput) => {
        const updatedblog = await prisma.blog.update({ where: filter, data });
        return updatedblog;
    },
 

    deleteblog: async (filter: Prisma.blogWhereUniqueInput) => {
        const deletedblog = await prisma.blog.delete({ where: filter });
        return deletedblog;
    }

}

export default blogService;
