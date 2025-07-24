import dotenv from "dotenv";

dotenv.config();

const SERVER_PORT = process.env.PORT ?? Number(process.env.SERVER_PORT);
const SECRET_KEY = process.env.SECRET_KEY ?? "secret";
const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY
const api_secret = process.env.API_SECRET
const pass = process.env.PASS_MAIL;
const mail = process.env.SEND_MAIL;
const clientId = process.env.PAY_PACK_CLIENT_ID;
const clientSecret = process.env.PAY_PACK_CLIENT_SECRET;
const environment = process.env.WEBHOOK_ENVIRONMENT;

export const config = {
    server: {
        PORT: SERVER_PORT,
    },
    key: {
        secret: SECRET_KEY,
    },
    env: process.env.NODE_ENV || "development",
    sendMail: {
        mail: mail,
    },
    passMail: {
        pass: pass,
    },
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
    payPack: {
        clientId,
        clientSecret,
    },
    webhook: {
        environment:environment,
    },
};
