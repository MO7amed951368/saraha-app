import { Router } from "express";
import * as messageService from './message.service.js'
import { BadRReqestError } from "../../common/utils/errors/exeption.error.js";
import { messageSchema } from "./message.validation.js";
import { uploadMulter } from "../../middelware/multer.middelware.js";
import { authenticate } from "../../middelware/authentication.middelware.js";
const messageRouter = new Router()

// send message
messageRouter.post('/send-message', uploadMulter({ desiredPath: 'messages' }).single('file'), async (req, res) => {
    const validateRusult = messageSchema.validate(req.body, { abortEarly: false })
    if (validateRusult.error) {
        throw new BadRReqestError("validation error", 400, { validationError: validateRusult.error.details }, "VALIDATION_ERROR")
    }
    const { content, receiverId } = req.body
    const file = req.file.path
    if (!content && !file) {
        throw new BadRReqestError("content or file is required", 404, "CONTENT_OR_FILE_REQUIRED");
    }
    const result = await messageService.sendMessage({ content, file, receiverId })
    res.status(201).json({ message: 'message sent successfuly ', data: result })


})

// get all messages by receiver id
messageRouter.get('/all-messages', authenticate, async (req, res) => {

    const result = await messageService.getAllMessagesByReceiverId(req.authUser._id)
    res.status(200).json({ message: 'messages fetched successfuly ', data: result })
})

//delete message by id
messageRouter.delete('/delete-message/:id', authenticate, async (req, res) => {
    const { id } = req.params
    const result = await messageService.deleteMessageById(id, req.authUser._id)
    res.status(200).json({ message: 'message deleted successfuly ', data: result })
})



export default messageRouter