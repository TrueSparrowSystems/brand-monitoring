const fs = require('fs'),
  path = require('path');

/**
 * Class for basic helper.
 *
 * @class BasicHelper
 */
class BasicHelper {
  /**
   * Get current timestamp in seconds.
   *
   * @return {number}
   */
  getCurrentTimestampInSeconds() {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Ensure directory existence. If directory does not exist, create one.
   *
   * @param {string} filePath
   *
   * @returns {boolean}
   */
  ensureDirectoryExistence(filePath) {
    const oThis = this;

    console.log('filePath', filePath);
    const dirname = path.dirname(filePath);

    console.log('dirname', dirname);

    if (fs.existsSync(dirname)) {
      return true;
    }

    oThis.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);

    return true;
  }

  /**
   * Sleep for particular time.
   *
   * @param {number} ms: time in ms
   *
   * @returns {Promise<any>}
   */
  sleep(ms) {
    // eslint-disable-next-line no-console

    return new Promise(function(resolve) {
      setTimeout(resolve, ms);
    });
  }
}

module.exports = new BasicHelper();
