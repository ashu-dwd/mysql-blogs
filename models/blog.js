const mysql = require('mysql2');
const pool = require('../connect');

const getAllBlogs = async () => {
  try {
    const result = await pool.query('SELECT * FROM blogs LEFT JOIN users ON blogs.authorId = users.user_id');
    return result[0];
  } catch (err) {
    throw err;
  }
};


const getBlogById = async (id) => {
  try {
    const result = await pool.query(`
      SELECT 
    blogs.*,
    users.user_id AS authorId,
    users.full_name AS author_name,
    users.profilePic AS profilePic,
    COUNT(DISTINCT blog_likes.like_id) AS total_likes,
    COUNT(DISTINCT blog_comments.comment_id) AS total_comments,
    GROUP_CONCAT(
        CONCAT(
            '{"comment": "', blog_comments.comment_text, '", ',
            '"username": "', comment_users.full_name, '", ',
            '"commented_at": "', blog_comments.commented_at, '"}'
        ) SEPARATOR ','
    ) AS comments
FROM blogs
LEFT JOIN users ON blogs.authorId = users.user_id
LEFT JOIN blog_likes ON blogs.blog_id = blog_likes.blog_id
LEFT JOIN blog_comments ON blogs.blog_id = blog_comments.blog_id
LEFT JOIN users AS comment_users ON blog_comments.user_id = comment_users.user_id
WHERE blogs.blog_id = ?
GROUP BY blogs.blog_id, users.user_id;

    `, [id]);
    
    return result[0];
  } catch (err) {
    throw err;
  }
};

const createBlog = async (blog) => {
  try {
    const result = await pool.query('INSERT INTO blogs SET ?', blog);
    return result;
  } catch (err) {
    throw err;
  }
};

const updateBlog = async (id, blog) => {
  try {
    const result = await pool.query('UPDATE blogs SET ? WHERE id = ?', [blog, id]);
    return result;
  } catch (err) {
    throw err;
  }
};

const deleteBlog = async (id) => {
  try {
    const result = await pool.query('DELETE FROM blogs WHERE id = ?', id);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};