require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const user = require("./user.js");
const authRouter = require("./authRouter").router;
const noteRouter = require("./notesRouter");
const accessTokenCreate = require("./authRouter").accessToken;
const cors = require("cors");

const app = express();

app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:5173'
        ];

        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS not allowed'), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization','x-refresh-token'],
    exposedHeaders: ['x-refresh-token']
}));

app.set("trust proxy", 1);

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/notes_backend")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const authenticate = async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1]
  const refreshToken = req.headers["x-refresh-token"]


  if (!accessToken || !refreshToken) {
    return res.status(401).json({ msg: "Tokens absent" }); //login again
  }

  try {
    const accessPayload = jwt.verify(accessToken, process.env.Access_token_key);
    const userInstance = await user.findOne({
      username: accessPayload.username,
    });
    if (accessPayload.tokenVersion !== userInstance.tokenVersion) {
      return res.status(401).json({ msg: "Unauthorised" });
    }
    if (req.username) {
      return res.status(401).json({ msg: "Parameter Not Required" });
    }
    req.username = accessPayload.username;
    return next();
  } catch (e) {
    if (e.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Unauthorised" });
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
        return res.status(401).json({ msg: "Unauthorised" });
      }
      const newToken = accessTokenCreate({
        username: refreshPayload.username,
        tokenVersion: refreshPayload.tokenVersion,
      });

      return res.status(200).json({
        msg:"refreshed",
        accessToken:newToken,
        lastPath:req.originalUrl
      })
    } catch (e) {
      if (e.name === "JsonWebTokenError") {
        return res.status(401).json({ msg: "Unauthorised" });
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
