import mysql from "mysql";

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost:3306',
    user            : 'usr_apirest',
    password        : '!q1w2e3r4$',
    database        : 'my_apidb'
 });

 export default pool;