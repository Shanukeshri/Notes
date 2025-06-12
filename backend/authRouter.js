require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("./user");

const router = express.Router();

const accessToken = (payload) => {
  return jwt.sign(payload, process.env.Access_token_key, { expiresIn: "10m" });
};
const refreshToken = (payload) => {
  return jwt.sign(payload, process.env.Refresh_token_key, { expiresIn: `5d` });
};

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(403).json({ msg: "All Field Required" });
  }

  const exist = await user.findOne({ username });
  if (exist) {
    return res.status(400).json({ msg: "Username already exists" });
  }
  const hashPswd = await bcrypt.hash(password, 10);
  const newUser = new user({
    username,
    password: hashPswd,
    email,
    tokenVersion: 0,
  });
  await newUser.save();

  return res.status(200).json({ msg: "Registered",
    accessToken:accessToken({ username, tokenVersion: 0 }),
    refreshToken:refreshToken({ username, tokenVersion: 0 })
   });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(403).json({ msg: "All Field Required" });
  }
  const exist = await user.findOne({ username });
  if (!exist) {
    return res.status(400).json({ msg: "Username Don't exists" });
  }
  const valid = await bcrypt.compare(password, exist.password);
  if (!valid) {
    return res.status(400).json({ msg: "Wrong Password" });
  }
  exist.tokenVersion += 1;
  await exist.save();
  return res.status(200).json({ msg: "Logged In" ,
    accessToken:accessToken({ username, tokenVersion: exist.tokenVersion }),
    refreshToken:refreshToken({ username, tokenVersion: exist.tokenVersion })

  });
});

router.post("/logout", async (req, res) => {
  console.log("logout attempted"); //debug

  try {
    const token = req.headers.authorization.split(" ")[1]
    const payload = await jwt.verify(
      token,
      process.env.Refresh_token_key
    );
    const username = payload.username;
    const userInstance = await user.findOne({ username: username });

    userInstance.tokenVersion += 1;
    await userInstance.save();
    return res.status(200).json({ msg: "Logged Out" });
  } catch (e) {
    console.log("Error while logging out :", e);
    return res.status(400).json({ msg: "Error While logging out" });
  }
});

module.exports = { router: router, accessToken };
