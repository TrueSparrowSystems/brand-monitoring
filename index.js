const rootPrefix = '.',
  GetNPSForTweets = require(rootPrefix + '/lib/User/GetNPS');
/**
 * Class exposed by this package
 *
 * @class BrandMonitoring
 */
class BrandMonitoring {
  constructor(twitterUserId, startTime, endTime, csvRequired) {
    const oThis = this;

    oThis.twitterUserId = twitterUserId;
    oThis.startTime = startTime;
    oThis.endTime = endTime;
    oThis.csvRequired = csvRequired;
  }

  /**
   * Get NPS result.
   *
   * @return {Promise<void>}
   */
  getNPS() {
    const oThis = this;

    const params = {
      twitterUserId: oThis.twitterUserId,
      startTime: oThis.startTime,
      endTime: oThis.endTime,
      csvRequired: oThis.csvRequired
    };

    new GetNPSForTweets(params).perform();
  }
}

module.exports = BrandMonitoring;
