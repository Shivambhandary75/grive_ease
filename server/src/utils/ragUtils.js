const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const STORE_FILE = path.join(DATA_DIR, "rag_store.json");

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(
      STORE_FILE,
      JSON.stringify({ documents: [], chunks: [] }, null, 2),
      "utf-8"
    );
  }
}

function loadStore() {
  ensureStore();
  try {
    const raw = fs.readFileSync(STORE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    return { documents: [], chunks: [] };
  }
}

function saveStore(store) {
  ensureStore();
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
}

// Simple text chunker: split by paragraphs/sentences and cap chunk size
function chunkText(text, maxLen = 1000) {
  if (!text) return [];
  const normalized = text.replace(/\r/g, "");
  const parts = normalized.split(/\n\n+|(?<=[.!?])\s+/g);
  const chunks = [];
  let buffer = "";
  for (const p of parts) {
    if ((buffer + " " + p).trim().length > maxLen) {
      if (buffer.trim()) chunks.push(buffer.trim());
      buffer = p;
    } else {
      buffer = (buffer + " " + p).trim();
    }
  }
  if (buffer.trim()) chunks.push(buffer.trim());
  return chunks.filter(Boolean);
}

function cosineSimilarity(a, b) {
  let dot = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = {
  ensureStore,
  loadStore,
  saveStore,
  chunkText,
  cosineSimilarity,
  STORE_FILE,
};
