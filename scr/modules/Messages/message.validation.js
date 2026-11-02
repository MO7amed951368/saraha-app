import joi from "joi";
export const messageSchema = joi.object({
    content: joi.string().min(1).max(500),
    file: joi.string(),
    receiverId: joi.string().required()

})