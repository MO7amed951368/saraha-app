import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    content: { type: String },
    file: { type: String },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
const Message = new mongoose.model('Message', messageSchema)
export default Message

