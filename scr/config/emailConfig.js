import nodemailer from "nodemailer";
import envConfig from "./env.config.js";

const { email } = envConfig;

export const emailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // false مع بورت 587 (TLS)
    auth: {
        user: email.user,
        pass: email.pass,
    },
});