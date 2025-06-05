const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  title: String,
  body: { type: String, required: true },
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
});

const note = mongoose.model("note", noteSchema);

module.exports = note;
