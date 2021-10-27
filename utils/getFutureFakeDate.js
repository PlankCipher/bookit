const getRandomInt = require('./getRandomInt.js');

const getFutureFakeDate = () => {
  const now = new Date().getTime();
  const newDate = new Date(
    now + getRandomInt(48 * 60 * 60 * 1000, 72 * 60 * 60 * 1000),
  );
  const day = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();
  return { year, month, day };
};

module.exports = getFutureFakeDate;
