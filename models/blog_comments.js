const mysql = require('mysql2');
const pool = require('../connect');

const insertUserComments = async (commentData) => {
  //const { blog_id, user_id, comment } = commentData;
  //commentData is an object of blogId,userId, comment
  console.log(commentData)
  const result = await pool.query('INSERT INTO blog_comments (blog_id, user_id, comment_text) VALUES (?, ?, ?)', [commentData.blogId, commentData.userId, commentData.comment]);
  return result;
}

module.exports = insertUserComments;