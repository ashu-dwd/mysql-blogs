const express = require("express");
const { getUserById } = require("../models/user");
const Blog = require("../models/blog");
const bycrypt = require("bcrypt");
const Route = express.Router();
const {
  handleUserSignUp,
  handleUserLogin,
  handleUserUpdatation,
  displayUserSpace,
  sendOtp,
  verifyOtp,
  deleteUserAccount,
} = require("../controllers/user");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/profilePics"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Configure multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

Route.get("/signup", (req, res) => res.render("signup"));
Route.post("/sendOtp", sendOtp);
Route.post("/verifyOtp", verifyOtp);
Route.post("/signUp", upload.single("img"), handleUserSignUp);
Route.get("/login", (req, res) => res.render("login")).post(
  "/login",
  handleUserLogin
);
Route.post("/updateUser", upload.single("img"), handleUserUpdatation);
Route.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

Route.get("/space", displayUserSpace);

Route.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);

    console.log(user);


    if (!user) {
      return res.status(404).send("User not found");
    }
    let sameUser = false;
    if (req.user && req.user.id == userId) {
      sameUser = true;
    }
    //console.log(user);
    res.render("profile", {
      userInfo: user,
      user: req.user,
      sameUser: sameUser,

    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
//Route.post('/sendOtp', handleUser)
Route.get('/deleteAccount/:id', (req, res) => res.render("deletePage", { user: req.user }));
Route.post('/deleteAccount/:id', deleteUserAccount);
module.exports = Route;
