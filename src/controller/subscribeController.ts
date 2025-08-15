import subscribeService from "../services/subscribeService";
import catchAsync from "../helper/catchAsync";
import { Request, Response } from "express";

const subscribeController = {
    // Subscribe to newsletter
    createSubscribe: catchAsync(async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const isExist = await subscribeService.isEmailExist(email)
            if (isExist) return res.status(400).json({ error: "Email is already subscribed" })
            const newSubscriber = await subscribeService.createSubscribe(email);
            return res.status(201).json({
                status: "success",
                message: "Successfully subscribed! You will receive notifications for new courses.",
                data: {
                    id: newSubscriber.id,
                    email: newSubscriber.email,
                    subscribedAt: newSubscriber.createdAt
                }
            });
        } catch (error) {
            console.log(error);
        }
    }),

    // Get all subscribers (admin only)
    getAllSubscribers: catchAsync(async (req: Request, res: Response) => {
        try {
            const subscribers = await subscribeService.getAllSubscribers();

            res.status(200).json({
                status: "success",
                message: "Subscribers retrieved successfully",
                data: subscribers,
                count: subscribers.length
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: "Failed to retrieve subscribers"
            });
        }
    }),

    // Unsubscribe
    deleteSubscribe: catchAsync(async (req: Request, res: Response) => {
        try {
            const { email } = req.params;

            if (!email) {
                return res.status(400).json({
                    status: "error",
                    message: "Email is required"
                });
            }

            await subscribeService.deleteSubscribe(email);

            res.status(200).json({
                status: "success",
                message: "Successfully unsubscribed"
            });
        } catch (error) {
            console.log(error);
        }
    }),

    // Check subscription status
    checkSubscription: catchAsync(async (req: Request, res: Response) => {
        try {
            const { email } = req.params;

            if (!email) {
                return res.status(400).json({
                    status: "error",
                    message: "Email is required"
                });
            }

            const subscriber = await subscribeService.getSubscriberByEmail(email);

            res.status(200).json({
                status: "success",
                data: {
                    isSubscribed: !!subscriber,
                    subscribedAt: subscriber?.createdAt || null
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: "Failed to check subscription status"
            });
        }
    }),

    // Notify subscribers about new course (to be called when new course is created)
    notifyNewCourse: catchAsync(async (req: Request, res: Response) => {
        try {
            const { courseTitle, courseDescription, courseId } = req.body;

            if (!courseTitle || !courseDescription || !courseId) {
                return res.status(400).json({
                    status: "error",
                    message: "Course title, description, and ID are required"
                });
            }

            const result = await subscribeService.notifyNewCourse(
                courseTitle,
                courseDescription,
                courseId
            );

            res.status(200).json({
                status: "success",
                message: result.message,
                data: {
                    notifiedCount: result.notifiedCount
                }
            });
        } catch (error) {
            console.log(error);
        }
    }),

    // Get subscription statistics (admin only)
    getSubscriptionStats: catchAsync(async (req: Request, res: Response) => {
        try {
            const stats = await subscribeService.getSubscriptionStats();

            res.status(200).json({
                status: "success",
                message: "Subscription stats retrieved successfully",
                data: stats
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: "Failed to retrieve subscription stats"
            });
        }
    })
};

export default subscribeController;
