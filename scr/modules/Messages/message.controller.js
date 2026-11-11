import { Router } from "express";
import * as messageService from './message.service.js'
import { BadRReqestError } from "../../common/utils/errors/exeption.error.js";
import { messageSchema } from "./message.validation.js";

import { authenticate } from "../../middlewares/authentication.middelware.js";
import { uploadToCloudinary } from "../../middlewares/cloudinaryMiddleware.js";
import { upload } from "../../middlewares/multer.middelware.js";
const messageRouter = new Router()

// send message
messageRouter.post('/send-message', upload.single('image'), uploadToCloudinary, async (req, res) => {
    const validateRusult = messageSchema.validate(req.body, { abortEarly: false })
    if (validateRusult.error) {
        throw new BadRReqestError("validation error", 400, { validationError: validateRusult.error.details }, "VALIDATION_ERROR")
    }
    const { content, receiver } = req.body
    const file = req.file
    if (!content && !file) {
        throw new BadRReqestError("content or file is required", 404, "CONTENT_OR_FILE_REQUIRED");
    }
    const result = await messageService.sendMessage({ content, file, receiver })
    res.status(201).json({ message: 'message sent successfuly ', data: result })


})

// get all messages by receiver id
messageRouter.get('/all-messages', authenticate, async (req, res) => {

    const result = await messageService.getAllMessagesByReceiverId(req.authUser._id)
    res.status(200).json({ message: 'messages fetched successfuly ', data: result })
})

// send anonymous message
messageRouter.post('/send-anonymous-message', upload.single('image'), uploadToCloudinary, messageService.sendAnonymousMessage)

// request identity of anonymous sender
messageRouter.post('/request-identity', authenticate, messageService.requestIdentity)

// get identity requests for a user
messageRouter.get('/identity-requests', authenticate, messageService.getIdentityRequests)

// handle identity request (accept/reject)
messageRouter.post('/handle-identity-request', authenticate, messageService.handleIdentityRequest)


export default messageRouter