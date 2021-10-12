const { Router } = require('express');
const Hall = require('../db/Hall.js');

const router = new Router();

router.get('/by-filters', async (req, res, next) => {
  try {
    const { filters } = req.body;

    const { err, halls } = await Hall.getHallsByFilters(filters);
    if (err) throw err;

    const finalHalls = halls.reduce((acc, curr) => {
      const { halls_id: id, name, price, booked_till } = curr;
      return [...acc, { id, name, price, booked_till }];
    }, []);

    res.json(finalHalls);
  } catch (err) {
    next(err);
  }
});

router.get('/all-filters', async (req, res, next) => {
  try {
    const { err, filters } = await Hall.getFilters();
    if (err) throw err;

    res.json(filters);
  } catch (err) {
    next(err);
  }
});

router.put('/book/:hallId', async (req, res, next) => {
  try {
    const { hallId } = req.params;
    const err = await Hall.bookAHall(hallId);
    if (err) throw err;

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
