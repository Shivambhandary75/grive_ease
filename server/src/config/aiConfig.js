/**
 * AI Configuration
 * Configuration for different AI providers
 */

module.exports = {
  // Gemini Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-pro",
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
    topK: 40,
  },

  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1,
  },

  // Local LLM Configuration
  local: {
    baseUrl: process.env.LOCAL_LLM_URL || "http://localhost:11434",
    model: process.env.LOCAL_MODEL || "llama2",
    temperature: 0.7,
    topP: 0.9,
  },

  // Default provider
  provider: process.env.AI_PROVIDER || "gemini",

  // File upload configuration
  fileUpload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    uploadDir: "uploads/ai-files",
  },

  // Conversation settings
  conversation: {
    maxMessagesPerSession: 100,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    autoDeleteOldSessions: true,
    deleteOlderThan: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // System prompts
  systemPrompts: {
    complaintAssistant: `You are a helpful AI assistant for GrieveEase, a complaint management platform. 
    Your role is to help users:
    1. Draft and refine their complaints
    2. Understand complaint procedures
    3. Get guidance on complaint resolution
    4. Analyze and categorize complaints
    
    Always be professional, empathetic, and constructive.`,

    complaintAnalyzer: `You are an expert complaint analyzer. 
    Analyze complaints and provide:
    1. Clear summary
    2. Identified issues
    3. Severity assessment
    4. Recommended next steps
    
    Be objective and thorough.`,
  },
};
