const express = require("express");
const { handleBlogUploading, handleBlogSearchById } = require("../controllers/blog");
const Router = express.Router();
const multer = require("multer");
const path = require("path");

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/coverImages"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Configure multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

Router.get("/", (req, res) => res.render("blogEditor", { user: req.user }));

// Correct the syntax for single image upload
Router.post("/upload", upload.single("coverImage"), handleBlogUploading);

Router.get('/:id', handleBlogSearchById);

module.exports = Router;
