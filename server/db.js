const mysql = require('mysql2');

// MySQL Connection Pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'sql8.freesqldatabase.com',
    user: 'sql8710557',
    password: 'abXgy2Pw47',
    database: 'sql8710557'
});

module.exports = pool;