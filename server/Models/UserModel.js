const mongoose = require("mongoose");
const userSchema = require("../Schemas/UserSchema");

const User = mongoose.model("User", userSchema);
module.exports = User;
