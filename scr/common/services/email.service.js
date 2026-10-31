import { emailTransporter } from "../../config/emailConfig.js";
import envConfig from "../../config/env.config.js";
import { BadRReqestError } from "../utils/errors/exeption.error.js";
import { EventEmitter } from 'events';

const { email } = envConfig;

// 1. Updated to accept an object with destructuring
export const sendEmail = async ({
    to,
    subject = "no-reply",
    message,
    attachments = []
}) => {
    if (!message && !attachments.length) {
        throw new BadRReqestError("message or attachment is required");
    }

    try {
        const info = await emailTransporter.sendMail({
            from: `"no-reply" <${email.user}>`,
            to,
            subject,
            html: message, // 'message' maps to html here
            attachments,
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (err) {
        console.error("Error while sending mail:", err);
        throw new BadRReqestError("Error while sending mail");
    }
};

export const eventEmitter = new EventEmitter();

eventEmitter.on("sendMailEvent", async ({ to, subject = "no-reply", message, attachments = [] }) => {
    try {
        // 2. Passes the object correctly matching the new signature
        await sendEmail({
            to,
            subject,
            message, // passed as 'message' (which maps cleanly)
            attachments,
        });
        
        console.log("Data received and email sent successfully!");
    } catch (error) {
        console.error("Failed to send email:", error);
    }
});