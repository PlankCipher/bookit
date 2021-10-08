const createHallsTable = `CREATE TABLE IF NOT EXISTS halls (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    last_booking_id INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    style VARCHAR(100) NOT NULL,
    place VARCHAR(150) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (last_booking_id) REFERENCES bookings(id)
)`;

const createBookingsTable = `CREATE TABLE IF NOT EXISTS bookings (
    id INT NOT NULL AUTO_INCREMENT,
    hall_id INT NOT NULL,
    booked_till DATE NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (hall_id) REFERENCES halls(id)
)`;

module.exports = [createHallsTable, createBookingsTable];
