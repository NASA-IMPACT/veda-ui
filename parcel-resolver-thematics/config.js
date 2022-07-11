/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs-extra');

function loadDeltaConfig() {
  try {
    const configPath = fs.realpathSync(process.env.DELTA_CONFIG_PATH);
    return {
      configPath,
      result: require(configPath),
      root: path.dirname(configPath)
    };
  } catch (error) {
    const configPath = fs.realpathSync(
      path.join(__dirname, '../mock/delta.config.js')
    );
    return {
      isDev: true,
      configPath: configPath,
      result: require(configPath),
      root: path.dirname(configPath)
    };
  }
}

module.exports = { loadDeltaConfig };
