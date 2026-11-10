
import joi from "joi";

export const messageSchema = joi.object({
    content: joi.string().min(1).max(500).required(),
    file: joi.string(),
    receiver: joi.string().required(),
    messageId: joi.string(),
    action: joi.string().valid('accepted', 'rejected'),

});

// export const identityRequestSchema = joi.object({
//     messageId: joi.string().hex().length(24).required()
// });

// export const handleRequestSchema = joi.object({
//     action: joi.string().valid('accepted', 'rejected').required()
// });

export const conversationMessageSchema = joi.object({
    content: joi.string().min(1).max(1000).required()
});