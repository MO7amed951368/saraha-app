// import mongoose from "mongoose";
// const messageSchema = new mongoose.Schema({
//     content: { type: String },
//     file: { type: String },
//     receiverId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     }
// }, { timestamps: true });
// const Message = new mongoose.model('Message', messageSchema)
// export default Message


import mongoose from "mongoose";
// models/Message.js
const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, 
    isAnonymous: { type: Boolean, default: true }
}, { timestamps: true });

// models/IdentityRequest.js
const identityRequestSchema = new mongoose.Schema({
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Receiver of the message who wants to know identity
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },   // The anonymous sender
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

// models/Conversation.js
const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // Linked original message
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });
const Message = new mongoose.model('Message', messageSchema)
export default Message
