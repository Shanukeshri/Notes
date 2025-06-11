require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const user = require("./user.js");
const authRouter = require("./authRouter").router;
const noteRouter = require("./notesRouter");
const accessTokenCreate = require("./authRouter").accessToken;
const cors = require("cors");

const app = express();

const allowedOrigins = ["http://localhost:5173","https://notes-frontend-rb43.onrender.com"];

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/notes_backend")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const authenticate = async (req, res, next) => {

  console.log("Authenticate middleware hit") //debug

  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ msg: "Tokens absent" }); //login again
  }

  try {
    const accessPayload = jwt.verify(accessToken, process.env.Access_token_key);
    const userInstance = await user.findOne({
      username: accessPayload.username,
    });
    if (accessPayload.tokenVersion !== userInstance.tokenVersion) {
      return res.status(401).json({ msg: "Unauthorised 1" });
    }
    if (req.username) {
      return res.status(401).json({ msg: "Parameter Not Required" });
    }
    req.username = accessPayload.username;
    return next();
  } catch (e) {
    if (e.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Unauthorised 2" });
    }
    try {
      //refreshing access token
      const refreshPayload = jwt.verify(
        refreshToken,
        process.env.Refresh_token_key
      );
      const userInstance = await user.findOne({
        username: refreshPayload.username,
      });
      if (userInstance.tokenVersion !== refreshPayload.tokenVersion) {
        console.log("user : ", userInstance, "\npayload : ", refreshPayload); //debug
        return res.status(401).json({ msg: "Unauthorised 3" });
      }
      const newToken = accessTokenCreate({
        username: refreshPayload.username,
        tokenVersion: refreshPayload.tokenVersion,
      });
      res.cookie("accessToken", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      req.cookies.accessToken = newToken;
      return authenticate(req, res, next);
    } catch (e) {
      if (e.name === "JsonWebTokenError") {
        return res.status(401).json({ msg: "Unauthorised 4" });
      } else if (e.name === "TokenExpiredError") {
        return res.status(400).json({ msg: "Please login again" });
      }
    }
  }
};

app.use("/auth", authRouter);
app.use("/note", authenticate, noteRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("server connected");
});
