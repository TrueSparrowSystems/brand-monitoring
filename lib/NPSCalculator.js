const rootPrefix = '..';

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
   * @param {array<objects>} sentimentsFromGoogleNLP
   * @param {number} totalTweets
   */
  constructor(sentimentsFromAWSComprehend, sentimentsFromGoogleNLP, totalTweets) {
    const oThis = this;

    oThis.sentimentsFromAWSComprehend = sentimentsFromAWSComprehend;
    oThis.sentimentsFromGoogleNLP = sentimentsFromGoogleNLP;
    oThis.totalTweetsCount = totalTweets;

    oThis.result = {};
  }

  /**
   * Performer for class
   *
   * @returns {Promise<[]|*[]>}
   */
  async perform() {
    const oThis = this;

    const AWSComprehendResult = await oThis._calculateNPSForSentimentsFromAWSComprehend();

    await oThis._calculateNPSForSentimentsFromGoogleNLP();

    oThis.result.AWSComprehend = AWSComprehendResult || {};

    console.log('oThis.result==========', oThis.result);

    return oThis.result;
  }

  /**
   *  Calculate NPS for sentiments from AWS Comprehend
   *
   * @returns {Promise<{nps: number, totalTweets: number, detractorsCount: number, promotersCount: number}>}
   * @private
   */
  async _calculateNPSForSentimentsFromAWSComprehend() {
    const oThis = this;

    const AWSComprehendResult = {
      nps: 0,
      promotersCount: 0,
      detractorsCount: 0,
      totalTweets: oThis.totalTweetsCount
    };

    let promotersCount = 0,
      detractorsCount = 0,
      nps = 0;
    for (let index = 0; index < oThis.sentimentsFromAWSComprehend.length; index++) {
      const documentSentimentObj = oThis.sentimentsFromAWSComprehend[index];
      if (documentSentimentObj.Sentiment == 'POSITIVE' && documentSentimentObj.SentimentScore.Positive > 0.8) {
        promotersCount += 1;
      } else if (documentSentimentObj.Sentiment == 'NEGATIVE' && documentSentimentObj.SentimentScore.Negative > 0.8) {
        detractorsCount += 1;
      }
    }

    AWSComprehendResult.promotersCount = promotersCount;
    AWSComprehendResult.detractorsCount = detractorsCount;
    nps = oThis._calculateNPS(promotersCount, detractorsCount);
    AWSComprehendResult.nps = nps;

    return AWSComprehendResult;
  }

  async _calculateNPSForSentimentsFromGoogleNLP() {
    const oThis = this;
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
}

module.exports = NPSCalculator;
