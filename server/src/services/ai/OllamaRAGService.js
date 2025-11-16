const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const ollamaConfig = require("../../config/ollamaConfig");
const {
  loadStore,
  saveStore,
  chunkText,
  cosineSimilarity,
} = require("../../utils/ragUtils");

class OllamaRAGService {
  constructor() {
    this.baseURL = ollamaConfig.host;
    this.apiKey = ollamaConfig.apiKey;
    this.model = ollamaConfig.model;
  }

  async init() {
    // No initialization needed for HTTP-based approach
    if (!this.apiKey || this.apiKey === "your_ollama_api_key_here") {
      console.warn(
        "⚠️  OLLAMA_API_KEY not set or using placeholder. API calls may fail."
      );
    }
  }

  /**
   * Make HTTP request to Ollama API
   */
  async makeRequest(endpoint, body) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
    };

    // Add authorization if API key is present
    if (this.apiKey && this.apiKey !== "your_ollama_api_key_here") {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Ollama API request failed:`, error);
      throw error;
    }
  }

  /**
   * Generate embeddings using Ollama
   * Note: Ollama's embedding support varies by model
   * For now, we'll use a simple hashing fallback for embeddings
   */
  async embed(text) {
    // Simple embedding fallback: create a vector from text characteristics
    // In production, use a proper embedding model or Ollama's embed endpoint if available
    const words = text.toLowerCase().split(/\s+/);
    const vector = new Array(384).fill(0); // Standard embedding size

    // Simple hash-based embedding
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        const idx = (charCode * (i + 1) * (j + 1)) % vector.length;
        vector[idx] += 1 / (i + 1); // Decay by position
      }
    }

    // Normalize
    const magnitude = Math.sqrt(
      vector.reduce((sum, val) => sum + val * val, 0)
    );
    return vector.map((v) => (magnitude > 0 ? v / magnitude : 0));
  }

  async ingestText(text, metadata = {}) {
    await this.init();
    const store = loadStore();
    const docId = `doc_${Date.now()}`;
    const chunks = chunkText(text);

    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i];
      const vector = await this.embed(content);
      store.chunks.push({
        id: `${docId}_chunk_${i}`,
        docId,
        content,
        vector,
        metadata,
      });
    }

    store.documents.push({
      id: docId,
      metadata,
      createdAt: new Date().toISOString(),
    });

    saveStore(store);
    return { docId, chunks: chunks.length };
  }

  async ingestFile(filePath, originalName) {
    const ext = path.extname(originalName || filePath).toLowerCase();
    let text = "";

    if (ext === ".pdf") {
      const data = await pdfParse(fs.readFileSync(filePath));
      text = data.text;
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({
        buffer: fs.readFileSync(filePath),
      });
      text = result.value || "";
    } else if (ext === ".txt") {
      text = fs.readFileSync(filePath, "utf-8");
    } else {
      throw new Error(`Unsupported file type: ${ext}`);
    }

    if (!text.trim()) throw new Error("No text extracted from file");
    return this.ingestText(text, { source: "file", name: originalName });
  }

  async retrieve(question, topK = ollamaConfig.topK) {
    await this.init();
    const store = loadStore();
    if (!store.chunks.length) return [];

    const qVec = await this.embed(question);
    const scored = store.chunks.map((c) => ({
      ...c,
      score: cosineSimilarity(qVec, c.vector),
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  buildPrompt(question, contexts) {
    const contextText =
      contexts.length > 0
        ? contexts
            .map(
              (c, idx) =>
                `[Context #${idx + 1} | relevance=${c.score.toFixed(3)}]\n${
                  c.content
                }`
            )
            .join("\n\n")
        : "No additional context available.";

    return `${ollamaConfig.systemPrompt}

Context from uploaded documents:
${contextText}

Student's Question/Complaint:
${question}

Please analyze this and provide:
1. A clear, helpful response
2. Whether this is a valid complaint (is_issue: yes/no with reason)
3. Key points (3-5 bullet points)
4. Suggested category (academic/facility/harassment/finance/admin/other)
5. Suggested severity (low/medium/high)
6. Next steps (2-3 specific actions)`;
  }

  async answer(question) {
    await this.init();
    const contexts = await this.retrieve(question);
    const prompt = this.buildPrompt(question, contexts);

    try {
      const response = await this.makeRequest("/api/chat", {
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        stream: false,
      });

      const text =
        response.message?.content ||
        response.response ||
        JSON.stringify(response);

      return {
        answer: text,
        contexts: contexts.map((c) => ({
          id: c.id,
          docId: c.docId,
          score: c.score,
          snippet: c.content.slice(0, 300),
        })),
        model: this.model,
      };
    } catch (error) {
      console.error("Ollama chat error:", error);
      throw new Error(`Ollama API error: ${error.message}`);
    }
  }

  /**
   * Simple chat without RAG context
   */
  async chat(userMessage) {
    await this.init();

    try {
      const response = await this.makeRequest("/api/chat", {
        model: this.model,
        messages: [
          { role: "system", content: ollamaConfig.systemPrompt },
          { role: "user", content: userMessage },
        ],
        stream: false,
      });

      return (
        response.message?.content ||
        response.response ||
        JSON.stringify(response)
      );
    } catch (error) {
      console.error("Ollama chat error:", error);
      throw new Error(`Ollama API error: ${error.message}`);
    }
  }
}

module.exports = OllamaRAGService;
