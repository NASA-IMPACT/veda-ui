const { defaults, mapValues } = require('lodash');

const defaultStrings = {
  stories: {
    one: 'Story',
    other: 'Stories'
  }
};

/**
 * Combine the default strings with the user-provided strings, while converting
 * single string values to an object with `one` and `other` keys.
 * @param {object} strings
 */
module.exports.withDefaultStrings = (strings) => {
  const objectifiedStrings = mapValues(strings, (value) =>
    typeof value === 'string' ? { one: value, other: value } : value
  );
  return defaults({}, objectifiedStrings, defaultStrings);
};
