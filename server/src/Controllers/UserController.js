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

    console.log("Registration attempt:", { email, role, institutionName });

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
    res.status(500).json({ message: "Server error", error: error.message });
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
