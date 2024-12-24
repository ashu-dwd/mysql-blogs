const mysql = require('mysql2');
const pool = require('../connect');

const getAllUsers = async () => {
  const results = await pool.query('SELECT * FROM users');
  return results;
};

const getUserById = async (id) => {
  const results = await pool.query('SELECT * FROM users WHERE user_id = ?', id);
  return results[0];
};

const createUser = async (user) => {
  const results = await pool.query('INSERT INTO users SET ?', user);
  return results.insertId;
};

const updateUser = async (id, user) => {
  const results = await pool.query('UPDATE users SET ? WHERE user_id = ?', [user, id]);
  return results.affectedRows;
};

const deleteUser = async (id) => {
  const results = await pool.query('DELETE FROM users WHERE user_id = ?', id);
  return results.affectedRows;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};