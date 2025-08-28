const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "friday"],
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    default: "New Conversation",
  },
  messages: [messageSchema],
  isArchived: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
conversationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Auto-generate title from first user message if not set
  if (
    this.isModified("messages") &&
    this.messages.length > 0 &&
    this.title === "New Conversation"
  ) {
    const firstUserMessage = this.messages.find((msg) => msg.sender === "user");
    if (firstUserMessage) {
      this.title =
        firstUserMessage.content.substring(0, 30) +
        (firstUserMessage.content.length > 30 ? "..." : "");
    }
  }

  next();
});

module.exports = mongoose.model("Conversation", conversationSchema);
