require("dotenv").config();
const router = require("express").Router();
const note = require("./notes.js");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const username = req.username;
  const noteArray = await note.find({ username }).sort({ dateUpdated: -1 });
  if (noteArray.length == 0) {
    return res.status(400).json({ msg: "No notes found" });
  }

  return res.status(200).json({ noteArray });
});

router.post("/", async (req, res) => {
  if (!req.body.body) {
    return res.status(400).json({ msg: "No note present to be added" });
  }
  const username = req.username;

  const { title, body } = req.body;

  const newNote = new note({
    username,
    title,
    body,
  });
  await newNote.save();
  return res.status(200).json({ msg: "Note Added Successfully" });
});

router.put("/", async (req, res) => {
  const { _id, title, body } = req.body;
  try {
    const noteFound = await note.findById(_id);
    if (!noteFound) {
      return res.status(404).json({ msg: "Note not found" });
    }

    const username = req.username;
    if (noteFound.username !== username) {
      return res.status(401).json({ msg: "unauthorise" });
    }
    noteFound.title = title;
    noteFound.body = body;
    noteFound.dateUpdated = Date.now();
    await noteFound.save();
    return res.status(200).json({ msg: "updated" });
  } catch (e) {
    console.log("error : ", e);
    return res.status(400).json({ msg: `error:${e}` });
  }
});

router.delete("/", async (req, res) => {
  try {
    const username = req.username;
    const { _id } = req.body;
    const noteFound = await note.findById(_id);

    if (!noteFound) {
      return res.status(404).json({ msg: "Note not found" });
    }

    if (noteFound.username !== username) {
      return res.status(403).json({ msg: "unauthorise" });
    }

    await noteFound.deleteOne();

    return res.status(200).json({ msg: "deleted succesfully" });
  } catch (e) {
    console.log("error", e);
    return res.status(400).json({ msg: "Some error happened" });
  }
});

module.exports = router;
