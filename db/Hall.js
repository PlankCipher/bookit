const execQuery = require('./execQuery.js');
const getUnique = require('../utils/getUnique.js');

class Hall {
  static async getHallsByFilters(filters) {
    try {
      const { category, style, place } = filters;

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

      const day = now.getDate() + 1;
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const booked_till = `${year}-${month}-${day}`;

      const insertBookingSQL =
        'INSERT INTO bookings (hall_id, booked_till) VALUES (?, ?)';
      const [insertBookingResult] = await execQuery(insertBookingSQL, [
        id,
        booked_till,
      ]);

      const updateHallSQL = 'UPDATE halls SET last_booking_id = ? WHERE id = ?';
      await execQuery(updateHallSQL, [insertBookingResult.insertId, id]);

      return null;
    } catch (err) {
      return err;
    }
  }
}

module.exports = Hall;
