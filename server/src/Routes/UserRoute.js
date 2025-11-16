const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
  deleteAccount,
} = require("../Controllers/UserController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/me", auth, updateProfile);
router.delete("/me", auth, deleteAccount);

module.exports = router;
