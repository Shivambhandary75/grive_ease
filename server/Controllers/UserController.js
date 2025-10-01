const User = require("../Models/UserModel");

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ error: "Error registering user", details: err.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        
        const user = await User.findOne(); 
        res.json({ profile: user });
    } catch (err) {
        res.status(500).json({ error: "Error fetching profile", details: err.message });
    }
};
