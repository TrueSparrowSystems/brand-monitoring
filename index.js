const rootPrefix = '.',
  GetNPSForTweets = require(rootPrefix + '/lib/GetNPS');
/**
 * Class exposed by this package
 *
 * @class BrandMonitoring
 */
class BrandMonitoring {
  constructor(twitterUserId, startTime, endTime) {
    const oThis = this;

    oThis.twitterUserId = twitterUserId;
    oThis.startTime = startTime;
    oThis.endTime = endTime;
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
      endTime: oThis.endTime
    };

    return new GetNPSForTweets(params).perform();
  }
}

module.exports = BrandMonitoring;
