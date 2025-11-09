const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        fileAttachments: [
          {
            fileName: String,
            fileUrl: String,
            fileType: String,
          },
        ],
      },
    ],
    topic: {
      type: String,
      default: "General Inquiry",
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    helpfulRating: {
      type: Number,
      enum: [-1, 0, 1], // -1: not helpful, 0: neutral, 1: helpful
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
