const _ = require('lodash');

const defaultStrings = {
  stories: {
    plural: 'Stories',
    singular: 'Story',
    zero: 'Stories'
  }
};

module.exports.withDefaultStrings = (strings) =>
  _.defaults({}, strings, defaultStrings);
