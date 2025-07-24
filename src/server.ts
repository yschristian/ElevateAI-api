import express from "express";
import cors from "cors";
import { config } from "./config/config";
import prisma from "./client";
import router from "./routes";
import swaggerDocs from "./swagger"
import { reminderSchedule } from "./helper/reminder";
import cron from "node-cron";

const app = express();
const basePath = "/api";

app.use(cors({ origin: "*" }));
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(basePath, router);

swaggerDocs(app, config.server.PORT);

cron.schedule("*/10 * * * *", async () => {
  console.log("Running scheduled job for sending reminder emails...");
  await reminderSchedule();
});

prisma.$connect().then(() => {
    console.log("Connected to the database");
  app.listen(config.server.PORT, () => {
    console.log(`Listening to localhost:${config.server.PORT}`);
  });
});
