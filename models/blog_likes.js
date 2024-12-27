const mysql = require('mysql2');
const pool = require('../connect');

const updateLikeSet = async (post_id, user_id) => {
    try {
       //const result1 = await pool.execute('UPDATE blogs SET likes = likes + 1 WHERE blog_id = ?', [post_id]);
       const result2 = await pool.query('INSERT INTO blog_likes (blog_id, user_id) VALUES (?, ?)', [post_id, user_id]);
       return [result2];
    } catch (error) {
        if (error.sqlState === '42000') {
            throw new Error('Post not found');
        }
        throw error;
    }
}

module.exports = {
    updateLikeSet
}
