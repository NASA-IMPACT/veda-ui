module.exports = {
  '*.(js|ts|tsx|jsx)': ['yarn eslint', 'yarn stylelint', () => 'yarn ts-check']
};
