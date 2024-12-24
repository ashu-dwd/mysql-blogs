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
    const result = await pool.query('SELECT * FROM blogs LEFT JOIN users ON blogs.authorId = users.user_id WHERE blogs.blog_id = ?', [id]);
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