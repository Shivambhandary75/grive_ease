const Chat = require("../../Schemas/AI/ChatSchema");
const AIService = require("../../services/ai/AIService");

/**
 * AI Controller
 * Handles all AI-related API endpoints
 */
class AIController {
  /**
   * Create a new chat session
   * POST /api/ai/chat/new
   */
  static async createChatSession(req, res) {
    try {
      const { userId, topic = "General Inquiry" } = req.body;

      const chatSession = new Chat({
        userId,
        sessionId: `session_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        topic,
        messages: [],
      });

      await chatSession.save();
      res.status(201).json({
        success: true,
        message: "Chat session created successfully",
        sessionId: chatSession.sessionId,
        data: chatSession,
      });
    } catch (error) {
      console.error("Error in createChatSession:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create chat session",
        error: error.message,
      });
    }
  }

  /**
   * Send message to AI
   * POST /api/ai/chat/message
   */
  static async sendMessage(req, res) {
    try {
      const { sessionId, userId, message, files = [] } = req.body;

      // Find or create chat session
      let chatSession = await Chat.findOne({ sessionId, userId });
      if (!chatSession) {
        chatSession = new Chat({
          userId,
          sessionId,
          messages: [],
        });
      }

      // Add user message to history
      chatSession.messages.push({
        role: "user",
        content: message,
        fileAttachments: files,
      });

      // Get AI response
      const conversationHistory = chatSession.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const aiResponse = await AIService.sendMessage(
        message,
        conversationHistory,
        files
      );

      // Add assistant response to history
      chatSession.messages.push({
        role: "assistant",
        content: aiResponse,
      });

      await chatSession.save();

      res.status(200).json({
        success: true,
        message: "Message processed successfully",
        response: aiResponse,
        sessionId: chatSession.sessionId,
      });
    } catch (error) {
      console.error("Error in sendMessage:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process message",
        error: error.message,
      });
    }
  }

  /**
   * Get chat history
   * GET /api/ai/chat/:sessionId
   */
  static async getChatHistory(req, res) {
    try {
      const { sessionId } = req.params;
      const { userId } = req.query;

      const chatSession = await Chat.findOne({ sessionId, userId });
      if (!chatSession) {
        return res.status(404).json({
          success: false,
          message: "Chat session not found",
        });
      }

      res.status(200).json({
        success: true,
        data: chatSession,
      });
    } catch (error) {
      console.error("Error in getChatHistory:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve chat history",
        error: error.message,
      });
    }
  }

  /**
   * Analyze complaint
   * POST /api/ai/analyze-complaint
   */
  static async analyzeComplaint(req, res) {
    try {
      const { complaint } = req.body;

      const analysis = await AIService.analyzeComplaint(complaint);

      res.status(200).json({
        success: true,
        message: "Complaint analyzed successfully",
        data: analysis,
      });
    } catch (error) {
      console.error("Error in analyzeComplaint:", error);
      res.status(500).json({
        success: false,
        message: "Failed to analyze complaint",
        error: error.message,
      });
    }
  }

  /**
   * Generate suggested responses
   * POST /api/ai/suggest-responses
   */
  static async generateSuggestedResponses(req, res) {
    try {
      const { complaintDescription } = req.body;

      const suggestions = await AIService.generateSuggestedResponses(
        complaintDescription
      );

      res.status(200).json({
        success: true,
        message: "Suggestions generated successfully",
        data: suggestions,
      });
    } catch (error) {
      console.error("Error in generateSuggestedResponses:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate suggestions",
        error: error.message,
      });
    }
  }

  /**
   * Rate AI response
   * POST /api/ai/chat/:sessionId/rate
   */
  static async rateResponse(req, res) {
    try {
      const { sessionId } = req.params;
      const { userId, rating } = req.body; // rating: -1, 0, 1

      const chatSession = await Chat.findOneAndUpdate(
        { sessionId, userId },
        { helpfulRating: rating },
        { new: true }
      );

      if (!chatSession) {
        return res.status(404).json({
          success: false,
          message: "Chat session not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Rating recorded successfully",
        data: chatSession,
      });
    } catch (error) {
      console.error("Error in rateResponse:", error);
      res.status(500).json({
        success: false,
        message: "Failed to record rating",
        error: error.message,
      });
    }
  }

  /**
   * Delete chat session
   * DELETE /api/ai/chat/:sessionId
   */
  static async deleteChatSession(req, res) {
    try {
      const { sessionId } = req.params;
      const { userId } = req.query;

      const result = await Chat.findOneAndDelete({ sessionId, userId });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Chat session not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Chat session deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteChatSession:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete chat session",
        error: error.message,
      });
    }
  }

  /**
   * Get all user chat sessions
   * GET /api/ai/user/:userId/chats
   */
  static async getUserChatSessions(req, res) {
    try {
      const { userId } = req.params;

      const chatSessions = await Chat.find({ userId })
        .select("sessionId topic resolved createdAt updatedAt helpfulRating")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: chatSessions,
      });
    } catch (error) {
      console.error("Error in getUserChatSessions:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve user chat sessions",
        error: error.message,
      });
    }
  }
}

module.exports = AIController;
