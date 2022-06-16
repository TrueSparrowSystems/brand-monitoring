const rootPrefix = '..',
  configProvider = require(rootPrefix + '/lib/configProvider');

let AWS_COMPREHEND_POSITIVE_TH = 0.55;
let AWS_COMPREHEND_NEGATIVE_TH = 0.4;

/**
 *  Class to calculate NPS percentage
 *
 * @class NPSCalculator
 */
class NPSCalculator {
  /**
   * Constructor calculate NPS percentage
   *
   * @param {array<objects>} sentimentsFromAWSComprehend
   * @param {number} totalTweets
   */
  constructor(sentimentsFromAWSComprehend, totalTweets) {
    const oThis = this;

    oThis.sentimentsFromAWSComprehend = sentimentsFromAWSComprehend;
    oThis.totalTweetsCount = totalTweets;

    oThis.awsThreshold = configProvider.getConfig('awsThreshold');

    oThis.result = {};
  }

  /**
   * Performer for class
   *
   * @returns {Promise<[]|*[]>}
   */
  perform() {
    const oThis = this;

    oThis._validateAndSetThreshold();

    const awsComprehendResult = oThis._calculateNPSForSentimentsFromAWSComprehend();

    oThis.result = awsComprehendResult || {};

    return oThis.result;
  }

  /**
   * Validate and set threshold.
   *
   * @private
   */
  _validateAndSetThreshold() {
    const oThis = this;

    if (oThis.awsThreshold && oThis.awsThreshold.positive && oThis.awsThreshold.negative) {
      if (
        oThis._isThresholdWithinRange(oThis.awsThreshold.positive) &&
        oThis._isThresholdWithinRange(oThis.awsThreshold.negative)
      ) {
        AWS_COMPREHEND_POSITIVE_TH = oThis.awsThreshold.positive;
        AWS_COMPREHEND_NEGATIVE_TH = oThis.awsThreshold.negative;
      }
    }
  }

  /**
   *  Calculate NPS for sentiments from AWS Comprehend
   *
   * @returns {Promise<{nps: number, totalTweets: number, detractorsCount: number, promotersCount: number}>}
   * @private
   */
  _calculateNPSForSentimentsFromAWSComprehend() {
    const oThis = this;

    const awsComprehendResult = {
      nps: 0,
      promotersCount: 0,
      detractorsCount: 0,
      totalTweets: oThis.totalTweetsCount
    };

    let promotersCount = 0,
      detractorsCount = 0;
    for (let index = 0; index < oThis.sentimentsFromAWSComprehend.length; index++) {
      const documentSentimentObj = oThis.sentimentsFromAWSComprehend[index];
      if (
        documentSentimentObj.Sentiment == 'POSITIVE' &&
        documentSentimentObj.SentimentScore.Positive > AWS_COMPREHEND_POSITIVE_TH
      ) {
        promotersCount += 1;
      } else if (
        documentSentimentObj.Sentiment == 'NEGATIVE' &&
        documentSentimentObj.SentimentScore.Negative > AWS_COMPREHEND_NEGATIVE_TH
      ) {
        detractorsCount += 1;
      }
    }

    awsComprehendResult.promotersCount = promotersCount;
    awsComprehendResult.detractorsCount = detractorsCount;
    awsComprehendResult.nps = oThis._calculateNPS(promotersCount, detractorsCount);

    return awsComprehendResult;
  }

  /**
   * Calculate NPS  //NPS = %(promoters) - %(detractors)
   *
   * @param {number} promotersCount
   * @param {number} detractorsCount\
   *
   * @returns {Promise<number>}
   * @private
   */
  _calculateNPS(promotersCount, detractorsCount) {
    const oThis = this;
    let nps = 0;

    const percentPromoters = (Number(promotersCount) / Number(oThis.totalTweetsCount)) * 100;
    const percentDetractors = (Number(detractorsCount) / Number(oThis.totalTweetsCount)) * 100;

    nps = percentPromoters - percentDetractors;

    return nps;
  }

  /**
   * Checks if threshold is within range.
   *
   * @param {number}threshold
   * @returns {boolean|boolean}
   * @private
   */
  _isThresholdWithinRange(threshold) {
    return threshold >= 0 && threshold <= 1;
  }
}

module.exports = NPSCalculator;
