const mysql = require('mysql2');

// MySQL Connection Pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '123123',
    database: 'your_database'
});

module.exports = pool;