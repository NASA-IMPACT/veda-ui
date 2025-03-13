/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const markdownit = require('markdown-it');
const md = markdownit();

/**
 * Stringify the given object so that it can be used in the veda module.
 *
 * We need to support functions in the yaml frontmatter so that some of the
 * values can be dynamically calculated. This would for example be:
 *
 *   id: some-id
 *   name: Some name
 *   datetime: (date) => date - 5 years // pseudo code
 *
 * Although evaluating functions could be supported by the yaml parser the
 * parcel module resolver must return the module contents as a string and
 * converting javascript back to source is complicated. The solution is to not
 * touch the function code, but instead remove the quotes so it is no longer a
 * string but javascript code. As this is exported as code it will be parsed
 * when the module is imported.
 *
 * This is done in a couple of steps:
 * 1) To define that the text in the yaml is javascript the user has to add `::js`
 *   id: some-id
 *   name: Some name
 *   datetime: ::js (date) => date - 5 years
 *
 * 2) When we're stringifying the frontmatter to json, if we're dealing with a
 *    function we add another ::js at the end. The result is:
 *   '{ "id": "some-id", "name": "Some name", "datetime": "::js (date) => date - 5 years ::js" }'
 *
 * 3) The last step is to use the ::js guards to remove the quotes around the
 *    function. When the module exports this it will be valid javascript code.
 *
 * @param {obj} data The object to stringify.
 * @param {string} filePath The path of the file where the data comes from.
 * @returns string
 */
function stringifyYmlWithFns(data, filePath) {
  const mdxData = {
    ...data,
    layers: data.layers?.map((l) => ({
      ...l,
      parentDataset: { id: data.id }
    }))
  };

  const jsonVal = JSON.stringify(mdxData, (k, v) => {
    if (typeof v === 'string') {
      if (v.match(/^(\r|\n\s)*::js/gim)) {
        return `${v} ::js`;
      }

      // Handle markdown string
      // @NOTE: MDX render that VEDA uses to render stories, dataset overview expects a loader to render the contents
      // (not straightforward to implement in frontmatter)
      // Therefore, we convert markdown to HTML so it can be rendered without the MDX renderer
      if (v.startsWith('::markdown')) {
        // Detach the prefix
        const p = v.replace(/^::markdown ?/, '');
        // Conver the string to HTML
        const parsedVal = md.render(p);
        // Get rid of any empty line
        return parsedVal.replace(/(\r\n|\n|\r)/gm, '');
      }

      // Handle file requires
      if (v.startsWith('::file')) {
        const p = v.replace(/^::file ?/, '');
        // file path is relative from the mdx file. Make it relative to this
        // module, so it works with the require.
        const absResourcePath = path.resolve(path.dirname(filePath), p);
        const relResourceFromModule = path.relative(__dirname, absResourcePath);
        // Export as a js expression so that is picked up below.
        return `::js require('${relResourceFromModule}') ::js`;
      }
    }
    return v;
  });

  const regex = new RegExp('(" *::js)(?:(?!::js).)+(::js")', 'gm');
  const matches = jsonVal.matchAll(regex);

  // Stringified version of the string after all replacements.
  let newVal = '';
  // Index of the last match.
  let index = 0;
  for (const match of matches) {
    // Anything before the match is left as is.
    newVal += jsonVal.substring(index, match.index);
    // Store the last index so we can keep the content from this match till the
    // next match, during the next iteration.
    index = match.index + match[0].length;
    // Replace the ::js indicator and any new lines.
    newVal += match[0]
      .replaceAll(/("::js *| *::js")/gi, '')
      .replaceAll('\\n', '\n');
  }
  // Add the rest from the last match.
  newVal += jsonVal.substring(index);

  return newVal;
}

module.exports = stringifyYmlWithFns;
