const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController");
const authMiddleware = require("../middleware/auth");

// Simple test route
router.get("/test", (req, res) => {
    res.send("User route working!");
});


router.post("/register", userController.registerUser);


router.get("/profile", authMiddleware, userController.getUserProfile);

module.exports = router;
