if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  require('dotenv').config();
}

module.exports = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};
