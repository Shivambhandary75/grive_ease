//Authentication Handling
const User = require("../Models/UserModel");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports.Signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already in use", success: false });
    }

    const user = new User({ email, username, password });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    user.emailVerificationExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    // Send verification email
    const verificationURL = `http://localhost:${
      process.env.PORT || 8080
    }/verify-email/${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your GrievEase email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Hello ${username},</h2>
          <p style="font-size: 16px; color: #555;">Thank you for signing up for GrievEase. Please verify your email by clicking the button below:</p>
          <a href="${verificationURL}" style="display: inline-block; padding: 12px 25px; margin: 15px 0; font-size: 16px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p style="font-size: 14px; color: #888;">Or copy and paste this link in your browser:</p>
          <p style="font-size: 12px; color: #666; background: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all;">${verificationURL}</p>
          <p style="font-size: 14px; color: #888;">This link will expire in 1 hour.</p>
          <p style="font-size: 14px; color: #888;">If you did not create an account, please ignore this email.</p>
        </div>
      `,
    });

    res.status(201).json({
      message:
        "Signup successful! Please check your email to verify your account.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports.verifyEmail = async (req, res) => {
  try {
    let { token } = req.params;

    console.log("Token verification process started");
    console.log("Raw token from URL:", token);
    console.log("Token length:", token.length);

    token = token.trim();

    if (token.length !== 64) {
      console.log("Invalid token length. Expected 64, got:", token.length);
      return res.status(400).json({
        message: "Invalid verification link format",
        success: false,
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("No user found with valid token");

      // Check if token exists but expired
      const expiredUser = await User.findOne({
        emailVerificationToken: hashedToken,
      });

      if (expiredUser) {
        console.log("Token found but expired");
        return res.status(400).json({
          message:
            "Verification link has expired. Please request a new verification email.",
          success: false,
        });
      }

      return res.status(400).json({
        message: "Invalid verification link",
        success: false,
      });
    }

    // Update user verification status
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully! You can now log in.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password", success: false });
    }

    if (!user.emailVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in",
        success: false,
      });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password", success: false });
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports.Logout = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res
      .status(200)
      .json({ message: "User logged out successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

//Forget Password logic
module.exports.ForgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token and expiration in user model (expires in 1 hour)
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    // Create reset URL
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
              <h2 style="color: #333;">Hello ${user.username},</h2>
              <p style="font-size: 16px; color: #555;">
                You requested a password reset for your GrievEase account.
              </p>
              <p style="font-size: 16px; color: #555;">
                Click the button below to reset your password:
              </p>
              <a href="${resetURL}" style="display: inline-block; padding: 12px 25px; margin: 15px 0; font-size: 16px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
                Reset Password
              </a>
              <p style="font-size: 14px; color: #888;">
                This link will expire in 1 hour.
              </p>
              <p style="font-size: 14px; color: #888;">
                If you did not request a password reset, you can safely ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
              <p style="font-size: 12px; color: #aaa;">
                Donor Connect Team
              </p>
            </div>
          `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Password reset link sent to email", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports.ResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Both password fields are required", success: false });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Passwords do not match", success: false });
    }

    // Hash the token from URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Finding user with this token and check expiration
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired token", success: false });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Password has been reset successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
