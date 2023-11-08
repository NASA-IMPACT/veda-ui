const { defaults, mapValues } = require('lodash');

const defaultStrings = ensureOneOther({
  stories: {
    one: 'Story',
    other: 'Stories'
  },
  storiesBanner:
    'Explore the guided narratives below to discover how NASA satellites and other Earth observing resources reveal a changing planet.',
  dataCatalogBanner:
    'This dashboard explores key indicators to track and compare changes over time.'
});

/**
 * Combine the default strings with the user-provided strings, while converting
 * single string values to an object with `one` and `other` keys.
 * @param {object} strings
 */
module.exports.withDefaultStrings = (strings) => {
  const objectifiedStrings = ensureOneOther(strings);
  return defaults({}, objectifiedStrings, defaultStrings);
};

function ensureOneOther(objectWithStrings) {
  return mapValues(objectWithStrings, (value) =>
    typeof value === 'string' ? { one: value, other: value } : value
  );
}
