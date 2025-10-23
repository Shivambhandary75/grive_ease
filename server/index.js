require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const cors = require("cors");
const authRoutes = require("./src/Routes/UserRoute");

mongoose
  .connect("mongodb://127.0.0.1:27017/etp_backend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
