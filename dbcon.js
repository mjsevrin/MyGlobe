var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_sevrinm',
  password        : '3157',
  database        : 'cs340_sevrinm'
});

module.exports.pool = pool;