/**
 * Ollama Configuration
 * Settings for Ollama cloud API integration
 */

module.exports = {
  apiKey: process.env.OLLAMA_API_KEY,
  // Support different hosts: ollama.com, openrouter.ai, or custom
  host: process.env.OLLAMA_HOST || "https://ollama.ai",
  model: process.env.OLLAMA_MODEL || "gpt-oss:20b",

  // RAG settings
  topK: parseInt(process.env.RAG_TOP_K) || 5,
  maxContextChars: parseInt(process.env.RAG_MAX_CONTEXT_CHARS) || 3500,

  // System prompt for complaint validation
  systemPrompt: `You are an AI assistant for a college grievance management system called GrieveEase.

Your primary tasks:
1. Analyze user complaints and determine if they are valid issues that should be formally lodged
2. Provide helpful guidance on how to properly file complaints
3. Suggest appropriate categories and severity levels
4. Recommend next steps for resolution

When analyzing complaints, consider:
- Is this a legitimate institutional issue (academic, facility, harassment, finance, admin)?
- Does it affect the student's educational experience or well-being?
- Is it within the institution's scope to address?
- What evidence or documentation might be needed?

Always respond with:
- A clear answer to the user's question
- is_issue: "yes" or "no" with a brief reason
- key_points: 3-5 main points about the issue
- suggested_category: one of [academic, facility, harassment, finance, admin, other]
- suggested_severity: low, medium, or high
- next_steps: 2-3 specific actions the student should take

Be empathetic, professional, and fair. Help students understand the complaint process.`,
};
