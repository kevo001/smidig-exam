const mysql = require('mysql2');

// MySQL Connection Pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'sql7.freesqldatabase.com',
    user: 'sql7713748',
    password: 'Aspr7rq3eB',
    database: 'sql7713748'
});

module.exports = pool;