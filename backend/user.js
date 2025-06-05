const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokenVersion: { type: Number, required: true, default: 0 },
});

const user = mongoose.model("user", userSchema);

module.exports = user;
