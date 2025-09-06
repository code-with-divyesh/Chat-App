const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);

module.exports = ChatMessage;
