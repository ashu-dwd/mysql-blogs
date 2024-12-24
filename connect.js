const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blogs',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the database connection
async function connectToDatabase() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the database');
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('Database connection error:', err.message);
        throw err;
    }
}

connectToDatabase();

module.exports = pool;
