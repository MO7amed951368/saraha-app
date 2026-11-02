import { populate } from "dotenv"
import { notFoundError } from "../../common/utils/errors/exeption.error.js"
import MessageRepository from "../../DB/repository/message.repository .js"
import UserRepository from "../../DB/repository/user.repository.js"


const messageRepository = new MessageRepository()
const userRepo = new UserRepository()

//send message
export const sendMessage = async ({ content, file, receiverId }) => {
    const user = await userRepo.findDocumentById(receiverId)
    if (!user) {
        throw new notFoundError("user not found", 404, "USER_NOT_FOUND")
    }
    const message = await messageRepository.createNewDocument({ content, file, receiverId })
    return message
}
// get all messages by receiver id
export const getAllMessagesByReceiverId = async (receiverId) => {
    return messageRepository.findDocuments({ receiverId })

}
//delete message by id
export const deleteMessageById = async (id, receiverId) => {
    const message = await messageRepository.findDocumentById(id)
    if (!message) {
        throw new notFoundError("message not found", 404, "MESSAGE_NOT_FOUND")
    }
    if (message.receiverId.toString() !== receiverId.toString()) {
        throw new notFoundError("you are not authorized to delete this message", 403, "UNAUTHORIZED")
    }
    return messageRepository.deleteDocumentById(id)
}


