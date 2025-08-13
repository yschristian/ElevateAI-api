import express from "express";
import authRoutes from "./authRoute";
import userRoute from "./userRoute"
import courseRoutes from "./courseRoute";
import lessonRoutes from "./lessonRoute";
import subLessons from "./subLessonRoute";
import assessmentRoutes from "./assessmentRoute";
import enrollmentRoutes from "./enrollmentRoute"
import progressRoutes from "./progressRoute";
import certificateRoutes from "./certificateRoute"
import scheduleRoutes from "./scheduleRoute"
import bogRoutes from "./blog";

const router = express.Router();

const routes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/user",
    route: userRoute
  },
  {
    path: "/course",
    route: courseRoutes,
  },
  {
    path: "/lesson",
    route: lessonRoutes,
  },
  {
    path: "/sublesson",
    route: subLessons
  },
  {
    path: "/assessment",
    route: assessmentRoutes
  },
  {
    path: "/enroll",
    route: enrollmentRoutes
  },
  {
    path: "/progress",
    route: progressRoutes,
  },
  {
    path: "/certificate",
    route: certificateRoutes
  },
  {
    path: "/schedule",
    route: scheduleRoutes
  },
  {
    path: "/blog",
    route: bogRoutes
  }

];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
