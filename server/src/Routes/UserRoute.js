//Authentication route
const router = require("express").Router();
const {
  Signup,
  Login,
  Logout,
  ForgetPassword,
  ResetPassword,
  verifyEmail,
} = require("../Controllers/UserController");

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/forget-password", ForgetPassword);
router.post("/reset-password/:token", ResetPassword);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
