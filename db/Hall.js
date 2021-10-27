const execQuery = require('./execQuery.js');
const getUnique = require('../utils/getUnique.js');
const getFutureFakeDate = require('../utils/getFutureFakeDate.js');

class Hall {
  static async getHallsByFilters(filters) {
    try {
      const { category, style, place } = filters;

      // The columns to select are specifically named to avoid ambiguity
      const getHallsByFiltersSQL = `SELECT halls.id AS 'halls_id', name, price, last_booking_id, category, style, place, bookings.id AS 'bookings_id', hall_id, booked_till
        FROM halls
        LEFT JOIN bookings
        ON halls.last_booking_id = bookings.id
        WHERE category = ? AND style = ? AND place = ?`;

      const [getHallsByFiltersResults] = await execQuery(getHallsByFiltersSQL, [
        category,
        style,
        place,
      ]);

      if (getHallsByFiltersResults.length < 1) {
        const err = new Error(
          'No halls matching the provided filters were found',
        );
        err.statusCode = 404;
        throw err;
      }

      return { err: null, halls: getHallsByFiltersResults };
    } catch (err) {
      return { err, halls: null };
    }
  }

  static async getHallById(id) {
    try {
      // The columns to select are specifically named to avoid ambiguity
      const getHallByIdSQL = `SELECT halls.id AS 'halls_id', name, price, last_booking_id, category, style, place, bookings.id AS 'bookings_id', hall_id, booked_till
        FROM halls
        LEFT JOIN bookings
        ON halls.last_booking_id = bookings.id
        WHERE halls.id = ?`;

      const [getHallByIdResult] = await execQuery(getHallByIdSQL, [id]);

      if (getHallByIdResult.length < 1) {
        const err = new Error(`Hall with id '${id}' not found`);
        err.statusCode = 404;
        throw err;
      }

      return { err: null, hall: getHallByIdResult[0] };
    } catch (err) {
      return { err, hall: null };
    }
  }

  static async getFilters() {
    try {
      // The SQL `DISTINCT` keyword was not used here, even though
      // unique values are required, because different combinations
      // of the three columns are considered distinct records. Also,
      // using separate connections and queries to get distinct values
      // of every filter seems unnecessary
      const getFiltersSQL = 'SELECT category, style, place FROM halls';
      const [getFiltersResults] = await execQuery(getFiltersSQL, null);

      const categories = getUnique(getFiltersResults, 'category');
      const styles = getUnique(getFiltersResults, 'style');
      const places = getUnique(getFiltersResults, 'place');

      return { err: null, filters: { categories, styles, places } };
    } catch (err) {
      return { err, filters: null };
    }
  }

  static async bookAHall(id) {
    try {
      const { err, hall } = await Hall.getHallById(id);
      if (err) throw err;

      const now = new Date();

      if (hall.booked_till && now.getTime() < hall.booked_till.getTime()) {
        const alreadyBookedErr = new Error(
          `Hall with id '${id}' is already booked`,
        );
        alreadyBookedErr.statusCode = 409;
        throw alreadyBookedErr;
      }

      const { year, month, day } = getFutureFakeDate();
      const booked_till = `${year}-${month}-${day}`;

      const insertBookingSQL =
        'INSERT INTO bookings (hall_id, booked_till) VALUES (?, ?)';
      const [insertBookingResult] = await execQuery(insertBookingSQL, [
        id,
        booked_till,
      ]);
      const { insertId: newLastBookingId } = insertBookingResult;

      const updateHallSQL = 'UPDATE halls SET last_booking_id = ? WHERE id = ?';
      await execQuery(updateHallSQL, [newLastBookingId, id]);

      // No need to get the updated hall from the database
      const finalHall = {
        ...hall,
        last_booking_id: newLastBookingId,
        bookings_id: newLastBookingId,
        booked_till,
      };

      return { err: null, hall: finalHall };
    } catch (err) {
      return { err, hall: null };
    }
  }
}

module.exports = Hall;
