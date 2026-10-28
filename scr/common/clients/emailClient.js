import nodemailer from "nodemailer";
import { emailTransporter } from "../../config/emailConfig.js";

export const transporter = nodemailer.createTransport(emailTransporter);