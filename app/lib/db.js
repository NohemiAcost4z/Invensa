import mysql from 'mysql2/promise';

const mysqlHost='localhost';
const mysqlUser='root';
const mysqlPort='3306';
const mysqlPassword='12345678';
const mysqlDatabase='invensa';

const connection = await mysql.createConnection({
  host: mysqlHost,
  port: mysqlPort,
  user: mysqlUser,
  database: mysqlDatabase,
  password: mysqlPassword,
});



export {
  connection,
};
