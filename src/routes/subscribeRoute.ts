import express from 'express';
import subscribeController from '../controller/subscribeController';
import { isAdmin, isLoggedIn } from "../middleware/isLoggedin";


const router = express.Router();

// Public routes
router.post('/subscribe', subscribeController.createSubscribe)
    .delete('/unsubscribe/:email', subscribeController.deleteSubscribe)
    .get('/check/:email', subscribeController.checkSubscription)
    // Admin routes (uncomment if you have authentication middleware)
    .get('/subscribers', isAdmin, subscribeController.getAllSubscribers)
    .get('/stats', isAdmin, subscribeController.getSubscriptionStats)
    .post('/notify', isAdmin, subscribeController.notifyNewCourse)


export default router;
