/*
 * Gets distinct values of a specific key
 * from each object from an array of objects
 * @returns: the array of distinct values
 * @example: getUnique([{ name: 'John' }, { name: 'Doe' }, { name: 'John' }], 'name');
 *           -> ['John', 'Doe']
 */
const getUnique = (array, key) =>
  array.reduce(
    (acc, curr) => (acc.includes(curr[key]) ? acc : [...acc, curr[key]]),
    [],
  );

module.exports = getUnique;
