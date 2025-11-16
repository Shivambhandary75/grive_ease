const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const OllamaRAGService = require("../services/ai/OllamaRAGService");

const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = express.Router();
const rag = new OllamaRAGService();
console.log(
  "RAG: using OllamaRAGService with model",
  process.env.OLLAMA_MODEL || "gpt-oss:20b"
);

// Health
router.get("/health", (req, res) => res.json({ ok: true }));

// Clear RAG store (called on login)
router.post("/clear", async (req, res) => {
  try {
    const { loadStore, saveStore } = require("../utils/ragUtils");
    const emptyStore = { documents: [], chunks: [] };
    saveStore(emptyStore);
    res.json({ success: true, message: "RAG store cleared" });
  } catch (e) {
    console.error("/clear error", e);
    res.status(500).json({ success: false, message: e.message });
  }
});

// Ingest raw text
router.post("/ingest-text", async (req, res) => {
  try {
    const { text, metadata } = req.body || {};
    if (!text || !text.trim())
      return res
        .status(400)
        .json({ success: false, message: "text is required" });
    const result = await rag.ingestText(text, metadata || { source: "text" });
    res.json({ success: true, data: result });
  } catch (e) {
    console.error("/ingest-text error", e);
    res.status(500).json({ success: false, message: e.message });
  }
});

// Upload files to ingest
router.post("/upload", upload.array("files", 5), async (req, res) => {
  try {
    if (!req.files || !req.files.length)
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    const results = [];
    for (const f of req.files) {
      const result = await rag.ingestFile(f.path, f.originalname);
      results.push({ file: f.originalname, ...result });
      // cleanup temp file
      fs.unlink(f.path, () => {});
    }
    res.json({ success: true, data: results });
  } catch (e) {
    console.error("/upload error", e);
    res.status(500).json({ success: false, message: e.message });
  }
});

// Ask a question with RAG
router.post("/query", async (req, res) => {
  try {
    const { question } = req.body || {};
    if (!question || !question.trim())
      return res
        .status(400)
        .json({ success: false, message: "question is required" });
    const result = await rag.answer(question);
    res.json({ success: true, data: result });
  } catch (e) {
    console.error("/query error", e);
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
