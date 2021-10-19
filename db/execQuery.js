const mysql = require('mysql2/promise');
const dbConfig = require('./connectionConfig.js');

/*
 * This helper function simply opens a connection with
 * the database, securely executes provided SQL query,
 * and closes the connection
 * @param: sql - sql query to execute
 * @param: values - an array of values to be used to fill
 *                  the '?' placeholders in the query securely
 * @returns: result of executing the query
 */
const execQuery = async (sql, values) => {
  const connection = await mysql.createConnection(dbConfig);

  const [result] = await connection.execute(sql, values);

  connection.end();

  return [result];
};

module.exports = execQuery;
