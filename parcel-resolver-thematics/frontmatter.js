/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs-extra');
const matter = require('gray-matter');

async function getFrontmatterData(filePath, logger) {
  const content = await fs.readFile(filePath, 'utf-8');
  try {
    // Pass an empty options object to avoid data being cached which is a
    // problem if there is an error. When an error happens the data is
    // cached as empty and no error are thrown the second time.
    return matter(content, {}).data;
  } catch (error) {
    logger.error({
      message: error.message,
      codeFrames: [
        {
          filePath,
          code: error.mark.buffer,
          codeHighlights: [
            {
              start: {
                line: error.mark.line,
                column: error.mark.column
              },
              end: {
                line: error.mark.line,
                column: error.mark.column
              }
            }
          ]
        }
      ]
    });
    return null;
  }
}

module.exports = {
  getFrontmatterData
};
