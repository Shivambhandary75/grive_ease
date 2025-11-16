const User = require("../Models/UserModel");
const Institution = require("../Models/Institution");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "24h",
  });
};

// Generate unique username
const generateUsername = async (preferred, emailHint) => {
  const baseRaw = (preferred || emailHint || "user").toString().trim();
  const base = baseRaw.replace(/\s+/g, "").toLowerCase();
  let username = base;
  let i = 0;
  while (await User.findOne({ username })) {
    i += 1;
    username = `${base}${i}`;
  }
  return username;
};

// Register User
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      institutionName,
      department,
      studentId,
      employeeId,
    } = req.body;

    console.log("Registration attempt:", {
      email,
      role,
      institutionName,
      name,
    });

    // Validation
    if (!name || !email || !password || !role || !institutionName) {
      return res.status(400).json({
        message:
          "Missing required fields: name, email, password, role, institutionName",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    let institution;

    if (role === "institutional") {
      // Check if institution already exists
      institution = await Institution.findOne({
        name: { $regex: new RegExp(institutionName, "i") },
      });

      if (institution) {
        return res.status(400).json({
          message: "Institution already exists. Please use a different name.",
        });
      }

      // Create user first
      const username = await generateUsername(
        req.body.username || name || email,
        email
      );
      user = new User({
        name,
        username,
        email,
        password,
        role,
        institution: null, // Temporary null
        department,
        studentId,
        employeeId,
      });
      await user.save();

      // Now create institution with admin reference
      institution = new Institution({
        name: institutionName,
        email: email,
        admin: user._id, // Set the admin to the created user
      });
      await institution.save();

      // Update user with institution reference
      user.institution = institution._id;
      await user.save();
    } else {
      // For students/teachers, find existing institution
      institution = await Institution.findOne({
        name: { $regex: new RegExp(institutionName, "i") },
      });

      if (!institution) {
        return res.status(400).json({ message: "Institution not found" });
      }

      const username = await generateUsername(
        req.body.username || name || email,
        email
      );
      user = new User({
        name,
        username,
        email,
        password,
        role,
        institution: institution._id,
        department,
        studentId,
        employeeId,
      });
      await user.save();
    }

    const token = generateToken(user._id);

    // Populate user data for response
    const userWithInstitution = await User.findById(user._id)
      .select("-password")
      .populate("institution");

    res.status(201).json({
      token,
      user: userWithInstitution,
    });
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
      details: error.errors
        ? Object.keys(error.errors).map((key) => ({
            field: key,
            message: error.errors[key].message,
          }))
        : null,
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("institution");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Current User
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("institution");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, department, studentId, employeeId } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (department !== undefined) user.department = department;

    // Role-specific updates
    if (user.role === "student" && studentId !== undefined) {
      user.studentId = studentId;
    }
    if (user.role === "teacher" && employeeId !== undefined) {
      user.employeeId = employeeId;
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id)
      .select("-password")
      .populate("institution");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete User Account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is institutional admin, delete the institution too
    if (user.role === "institutional" && user.institution) {
      await Institution.findByIdAndDelete(user.institution);
      console.log(`Deleted institution: ${user.institution}`);
    }

    // Delete the user
    await User.findByIdAndDelete(userId);
    console.log(`Deleted user: ${userId}`);

    res.json({
      message: "Account deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
