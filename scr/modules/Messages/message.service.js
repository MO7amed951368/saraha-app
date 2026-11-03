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



