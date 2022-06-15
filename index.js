const rootPrefix = '.',
  GetStats = require(rootPrefix + '/lib/GetStats'),
  configProvider = require(rootPrefix + '/lib/configProvider');

/**
 * Class exposed by this package
 *
 * @class BrandMonitoring
 */
class BrandMonitoring {
  constructor(twitterApiConfig, awsComprehendConfig) {
    // Saving the params in-memory via configProvider
    configProvider.setConfig('twitterApiConfig', twitterApiConfig);
    configProvider.setConfig('awsComprehendConfig', awsComprehendConfig);
  }

  /**
   * Get statistics.
   *
   * @return {Promise<void>}
   */
  getStats(reportParams) {
    const params = {
      twitterUserId: reportParams.twitterUserId,
      startTimestamp: reportParams.startTimestamp,
      endTimestamp: reportParams.endTimestamp
    };

    configProvider.setConfig('awsThreshold', reportParams.awsThreshold);

    return new GetStats(params).perform();
  }
}

module.exports = BrandMonitoring;
