const {createBlog, getBlogById} = require("../models/blog");
const { updateLikeSet } = require("../models/blog_likes");
const User = require("../models/user");
const handleBlogUploading = async (req, res) => {
  try {
    const { title, desc, content } = req.body;
    const coverImage = req.file;

    console.log("Cover Image:", coverImage);

    // Save only the image filename to the database
    const coverImageName = coverImage ? coverImage.filename : null;
      const blog = {
        title:title,
        desc:desc,
        content:content,
        coverImage: coverImageName, // Save only the filename
        authorId: req.user.id,
      }
    const result = await createBlog(blog);

    console.log("Blog entry created:", result[0]);

    res.redirect(`/blogs/${result[0].insertId}`);
  } catch (error) {
    console.error("Blog Upload Error:", error.message);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const handleBlogSearchById = async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await getBlogById(blogId);
    console.log(blog)
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    //req.user.blog_id = blogId;
    res.render("blog", { blog, user: req.user });
  } catch (error) {
    console.error("Error fetching blog:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const handleBlogLikes = async (req, res) => {
  const blogId = req.body.blog_id;
  const userId = req.user.id;
  const result = await updateLikeSet(blogId, userId);
  if (result === "already liked") {
    res.json("You have already liked this blog");
  } else {
    res.json("liked");
  }
}



module.exports = {
  handleBlogUploading,
  handleBlogSearchById,
  handleBlogLikes
};
