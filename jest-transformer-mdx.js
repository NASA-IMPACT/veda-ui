/* eslint-disable no-unused-vars */
// const mdx = require('@mdx-js/react');

/**
 * Currently, Jest tests for components importing MDX content will fail.
 * Properly setting up MDX rendering in Jest is complex. For now,
 * we will render the MDX content as null to prevent Jest errors.
 */

const transformer = {
  process: function (sourceText, sourcePath, options) {
    return {
      code: 'module.exports = () => null'
    };
  }
};

module.exports = transformer;
