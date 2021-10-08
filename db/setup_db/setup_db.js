const mysql = require('mysql2/promise');
const tablesCreationSQLS = require('./tables_creation_sqls.js');
const dbConfig = require('../connectionConfig.js');

const createTablesIfNotExist = async (connection) => {
  try {
    tablesCreationSQLS.forEach(async (sqlQuery) => {
      await connection.execute(sqlQuery);
    });
  } catch (err) {
    console.log(err);
    connection.end();
  }
};

const getRandomInt = (min, max) => {
  return min + Math.floor(Math.random() * (max + 1 - min));
};

const getFakeDate = () => {
  const date = new Date();
  const day = date.getDay() + 1 + getRandomInt(1, 7);
  const month = date.getMonth() + 1 + getRandomInt(0, 1);
  const year = date.getFullYear();
  return { year, month, day };
};

const seedTables = async (connection) => {
  try {
    const names = [
      'Tim Brothers',
      'Gold Stars',
      'Torteno Halls',
      'Arzon',
      'Chang',
    ];
    const categories = ['prom', 'wedding', 'event'];
    const styles = ['traditional', 'modern', 'fancy'];
    const places = ['new york city', 'los angeles', 'california', 'colorado'];

    for (let i = 0; i < names.length; i++) {
      for (let j = 0; j < categories.length; j++) {
        for (let k = 0; k < styles.length; k++) {
          for (let l = 0; l < places.length; l++) {
            let lastBookedId = 0;

            // A 50/50 chance that the hall is booked
            if (Math.random() > 0.5) {
              const { year, month, day } = getFakeDate();
              const bookedTill = `${year}-${month}-${day}`;

              const [bookingInsertionResult] = await connection.execute(
                'INSERT INTO bookings (hall_id, booked_till) VALUES (0, ?)',
                [bookedTill],
              );
              lastBookedId = bookingInsertionResult.insertId;
            }

            const price = getRandomInt(100, 300).toFixed(2);

            const [hallInsertionResult] = await connection.execute(
              'INSERT INTO halls (name, price, last_booking_id, category, style, place) VALUES (?, ?, ?, ?, ?, ?)',
              [
                names[i],
                price,
                lastBookedId,
                categories[j],
                styles[k],
                places[l],
              ],
            );

            await connection.execute(
              'UPDATE bookings SET hall_id = ? WHERE hall_id = 0',
              [hallInsertionResult.insertId],
            );
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
    connection.end();
  }
};

(async () => {
  const connection = await mysql.createConnection(dbConfig);
  await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

  await createTablesIfNotExist(connection);
  await seedTables(connection);

  await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
  connection.end();
})();
