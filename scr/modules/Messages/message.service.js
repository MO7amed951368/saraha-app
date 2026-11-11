import { notFoundError } from "../../common/utils/errors/exeption.error.js"
import MessageRepository from "../../DB/repository/message.repository .js"
import UserRepository from "../../DB/repository/user.repository.js"
import Message from "../../DB/models/message.model.js"


const messageRepository = new MessageRepository()
const userRepo = new UserRepository()

//send message
export const sendMessage = async ({ content, file, receiver }) => {
    const user = await userRepo.findDocumentById(receiver)
    if (!user) {
        throw new notFoundError("user not found", 404, "USER_NOT_FOUND")
    }
    const message = await messageRepository.createNewDocument({ content, file, receiver })
    return message
}
// get all messages by receiver id
export const getAllMessagesByReceiverId = async (receiverId) => {
    return messageRepository.findDocuments({ receiver: receiverId })


}
// send anonymous message
export const sendAnonymousMessage = async (req, res) => {
    try {
        const { content, file, receiverId } = req.body;
        const receiver = await userRepo.findDocumentById(receiverId);
        if (!receiver) return res.status(404).json({ error: "Receiver not found" });
        const message = await messageRepository.createNewDocument({
            content, file, receiver: receiverId, sender: req.user ? req.user._id : null,
            isAnonymous: !req.user
        })
        res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// request identity of anonymous sender
export const requestIdentity = async (req, res) => {
    try {
        const { messageId } = req.body;
        const message = await Message.findById(messageId);
        if (!message || message.receiver.toString() !== req.authUser._id.toString()) {
            return res.status(403).json({ error: "Unauthorized or message not found" });
        }
        if (!message.sender) {
            return res.status(400).json({ error: "Cannot request identity for an unregistered sender" });
        }
        const existingRequest = await messageRepository.findDocumentById({ messageId });
        if (existingRequest) return res.status(400).json({ error: "Request already sent" });

        const request = await messageRepository.create({
            messageId,
            receiver: req.authUser._id,
            sender: message.sender,
            status: 'pending'
        });
        res.status(201).json({ message: "Identity request sent successfully", data: request });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// get identity requests for a user
export const getIdentityRequests = async (req, res) => {
    try {
        const requests = await userRepo.findDocuments({ receiver: req.authUser._id })
            .populate('sender', 'username profilePic')
            .populate('messageId', 'content');
        res.status(200).json({ data: requests });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// handle identity request (accept/reject)
export const handleIdentityRequest = async (req, res) => {
    try {
        const { requestId, action } = req.body;

        if (!['accept', 'reject'].includes(action)) {
            return res.status(400).json({ error: "Invalid action" });
        }

        const request = await userRepo.findDocumentById(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        if (!request._id || !req.authUser?._id) {
            return res.status(400).json({ error: "Invalid request data or user session" });
        }

        const receiverId = request._id ? request._id.toString() : request.toString();
        const currentUserId = req.authUser._id.toString();

        if (receiverId !== currentUserId) {
            return res.status(403).json({ error: "Not authorized to handle this request" });
        }

        request.status = action === 'accept' ? 'accepted' : 'rejected';
        await request.save();

        res.status(200).json({ message: `Request ${action}ed successfully`, data: request });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




