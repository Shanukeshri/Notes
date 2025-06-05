require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const user = require("./user.cjs");
const authRouter = require("./authRouter").router;
const noteRouter = require("./notesRouter");
const accessTokenCreate = require("./authRoute").accessToken;
const cors = require("cors")
const rateLimit = require("express-rate-limit")

const app = express();

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}))

const limiter = rateLimit({
  windowMs:1000*60*5,
  max:10,
  message:{msg:"Wait some times before trying again"}
})

app.use(limiter)


app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const authenticate = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if(!accessToken || !refreshToken){
    return res.status(401).json({msg:"Invaild request"}) //login again
  }

  try {
    const accessPayload = jwt.verify(accessToken, process.env.Access_token_key);
    const userInstance = await user.findOne({
      username: accessPayload.username,
    });
    if (accessPayload.tokenVersion !== userInstance.tokenVersion) {
      return res.status(401).json({ msg: "Unauthorised" });
    }
    if(req.username){
      return res.status(403).json({msg:"Parameter Not Required"})
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
      res.clearCookie("accessToken");
      const newToken = accessTokenCreate({
        username: refreshPayload.username,
        tokenVersion: refreshPayload.tokenVersion,
      });
      res.cookie("accessToken", newToken, { httpOnly: true });
      req.cookies.accessToken = newToken;
      return authenticate(req, res, next);
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

app.listen(3000, () => {
  console.log("server connected");
});
