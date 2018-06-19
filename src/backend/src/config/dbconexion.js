const mysql = require('mysql');

module.exports = function () {
    return mysql.createConnection({
        host: 'localhost',
        user: 'arduino',
        password: 'arduino',
        database: 'greenhouse'
    })
}