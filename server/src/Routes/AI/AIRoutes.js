const express = require("express");
const AIController = require("../../Controllers/AI/AIController");

const router = express.Router();

/**
 * AI Routes
 * All routes for AI chat functionality
 */

// Chat session management
router.post("/chat/new", AIController.createChatSession);
router.post("/chat/message", AIController.sendMessage);
router.get("/chat/:sessionId", AIController.getChatHistory);
router.delete("/chat/:sessionId", AIController.deleteChatSession);

// Chat rating
router.post("/chat/:sessionId/rate", AIController.rateResponse);

// Complaint analysis
router.post("/analyze-complaint", AIController.analyzeComplaint);
router.post("/suggest-responses", AIController.generateSuggestedResponses);

// User chat sessions
router.get("/user/:userId/chats", AIController.getUserChatSessions);

module.exports = router;
