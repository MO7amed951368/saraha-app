import { emailTransporter } from "../../config/emailConfig.js";
import envConfig from "../../config/env.config.js";
import { BadRReqestError } from "../utils/errors/exeption.error.js";

const { email } = envConfig;

export const sendEmail = async (
    to,
    subject = "no-reply",
    message,
    attachments = []
) => {
    if (!message && !attachments.length) {
        throw new BadRReqestError("message or attachment is required");
    }

    try {
        const info = await emailTransporter.sendMail({
            from: `"no-reply" <${email.user}>`, 
            to,
            subject,
            html: message,
            attachments, 
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (err) {
        console.error("Error while sending mail:", err);
        throw new BadRReqestError("Error while sending mail");
    }
};