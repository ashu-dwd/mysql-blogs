const express = require("express");
const Route = express.Router();
const path = require("path");
const {getAllBlogs} = require("../models/blog");
const {getUserById} = require("../models/user");
const { generateSummary, generateBlogContent } = require("../controllers/ai");
//dirName = path.join();

Route.get("/", async (req, res) => {
  const allBlogs = await getAllBlogs();
  //console.log(allBlogs)
  for (const blog of allBlogs) {
    try {
      const author =  getUserById(blog.authorId);
      blog.authorName = author; // Attach author details to the blog
    } catch (err) {
      console.error(`User not found for author ID: ${blog.author}`);
      blog.authorDetails = null;
    }
  }
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

Route.post("/ai", generateSummary);
Route.post("/generate-blog", generateBlogContent);

module.exports = Route;
