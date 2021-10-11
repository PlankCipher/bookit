const getRandomInt = (min, max) =>
  min + Math.floor(Math.random() * (max + 1 - min));

module.exports = getRandomInt;
