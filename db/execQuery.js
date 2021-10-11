const mysql = require('mysql2/promise');
const dbConfig = require('./connectionConfig.js');

const execQuery = async (sql, values) => {
  const connection = await mysql.createConnection(dbConfig);

  const [result] = await connection.execute(sql, values);

  connection.end();

  return [result];
};

module.exports = execQuery;
