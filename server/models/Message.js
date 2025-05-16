const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderType' }, 
  senderType: { type: String, enum: ['Teacher', 'Student'], required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'receiverType' },
  receiverType: { type: String, enum: ['Teacher', 'Student'], required: true },
  content: { type: String },
  attachment: {
    type: { type: String, enum: ['text', 'pdf', 'video', 'voice', 'other'], default: null },
    path: { type: String, default: null },
    name: { type: String, default: null },
  },
  conversationId: { type: mongoose.Schema.Types.ObjectId },
  sentAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
}, { timestamps: true });

messageSchema.index({ senderId: 1, receiverId: 1, sentAt: -1 }); 
messageSchema.index({ conversationId: 1, sentAt: -1 }); 

module.exports = mongoose.model('Message', messageSchema);