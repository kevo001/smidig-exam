const mysql = require('mysql2');

// MySQL Connection Pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'sql8.freesqldatabase.com',
    user: 'sql8712194',
    password: '79YJfeSGaQ',
    database: 'sql8712194'
});

module.exports = pool;