const getUnique = (array, key) =>
  array.reduce(
    (acc, curr) => (acc.includes(curr[key]) ? acc : [...acc, curr[key]]),
    [],
  );

module.exports = getUnique;
