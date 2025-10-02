const express = require("express");
const mongoose = require("mongoose"); 
const app = express();
const port = 8080;


mongoose
  .connect("mongodb://127.0.0.1:27017/etp_backend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());


const userRoutes = require("./src/Routes/UserRoute");
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("Working Properly");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
