const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  title: { type: String, required: true },
  body: { type: String},
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
});

const note = mongoose.model("note", noteSchema);

module.exports = note;
