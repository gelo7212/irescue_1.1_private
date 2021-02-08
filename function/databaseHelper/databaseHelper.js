
var mysql2Promise  = require('mysql2');const port = 3311;
// conts port = 3306;
const user = 'root';
const password = '';
const pool = mysql2Promise.createPool({
  host: 'localhost',
  port:port,
  user: 'root',
  database: 'irescue',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  password : password,
  multipleStatements: true,
  supportBigNumbers: true,
  bigNumberStrings: true 
})
const pool_pass = mysql2Promise.createPool({
  host: 'localhost',
  port:port,
  user: 'root',
  database: 'irescue_account',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  password : password,
  multipleStatements: true,
  supportBigNumbers: true,
  bigNumberStrings: true 
})
const options = {
  host: 'localhost',
  port:port,
  user: 'root',
  database: 'irescue',
  serverId    : 256,
  minInterval : 200,
  password : password,
}
// Eskabetche@7212
//root
//eskabetche721
module.exports = { pool,pool_pass,mysql2Promise,options}