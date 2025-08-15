import { Prisma } from "@prisma/client";
import prisma from "../client";
import mailer from "../helper/mail";

const subscribeService = {
    // Create a new subscription
    isEmailExist: async (email: string) => {
        const user = await prisma.subscriber.findUnique({
            where: {
                email,
            },
        });
        return user;
    },

    createSubscribe: async (email: string) => {
        try {
            const newSubscriber = await prisma.subscriber.create({
                data: { email }
            });
            await mailer(
                { 
                    email, 
                }, 
                "Subscribe"
            );

            return newSubscriber;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error("Email is already subscribed");
                }
            }
            throw error;
        }
    },

    // Get all subscribers
    getAllSubscribers: async () => {
        return await prisma.subscriber.findMany({
            orderBy: { createdAt: 'desc' }
        });
    },

    // Get subscriber by email
    getSubscriberByEmail: async (email: string) => {
        return await prisma.subscriber.findUnique({
            where: { email }
        });
    },

    // Delete subscription (unsubscribe)
    deleteSubscribe: async (email: string) => {
        const subscriber = await prisma.subscriber.findUnique({
            where: { email }
        });

        if (!subscriber) {
            throw new Error("Email not found in subscribers list");
        }

        return await prisma.subscriber.delete({
            where: { email }
        });
    },

    // Notify all subscribers about new course
    notifyNewCourse: async (courseTitle: string, courseDescription: string, courseId: string) => {
        try {
            const subscribers = await prisma.subscriber.findMany();
            if (subscribers.length === 0) {
                return { message: "No subscribers to notify" };
            }
            // Send email to all subscribers
            const emailPromises = subscribers.map(subscriber => 
                mailer(
                    {
                        email: subscriber.email,
                    },
                    "NewCourse",
                    {
                        courseTitle,
                        courseDescription,
                        courseId
                    }
                )
            );

            await Promise.all(emailPromises);
            return { 
                message: `Notification sent to ${subscribers.length} subscribers`,
                notifiedCount: subscribers.length
            };
        } catch (error) {
            throw new Error(`Failed to notify subscribers: ${error}`);
        }
    },

    // Get subscription stats
    getSubscriptionStats: async () => {
        const totalSubscribers = await prisma.subscriber.count();
        const recentSubscribers = await prisma.subscriber.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 30))
                }
            }
        });

        return {
            totalSubscribers,
            recentSubscribers,
            subscriptionDate: new Date()
        };
    }
};

export default subscribeService;
