require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const cors = require("cors");
const authRoutes = require("./src/Routes/UserRoute");
const ComplaintRoute = require("./src/Routes/complaints");
const InstitutionRoute = require("./src/Routes/institutions");
// const askAIRoutes = require("./src/Routes/AskAIRoutes"); // Disabled - using Ollama RAG instead
const ragRoutes = require("./src/Routes/RagRoutes");

mongoose
  .connect("mongodb://127.0.0.1:27017/etp_backend")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

// CORS: allow common localhost dev ports and handle preflight
// In dev, reflect any origin to avoid CORS surprises
app.use(
  cors({
    origin: true, // echoes the request origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Working");
});
app.use("/api/auth", authRoutes);
app.use("/api/complaints", ComplaintRoute);
app.use("/api/institution", InstitutionRoute);

// Error handling middleware

app.use("/", authRoutes);
// app.use("/api/ask-ai", askAIRoutes); // Disabled - using Ollama RAG routes instead
app.use("/api/ask-ai-rag", ragRoutes);
app.use("/api/ask-ai", ragRoutes); // Make /api/ask-ai also use Ollama RAG for compatibility



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
