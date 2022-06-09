const rootPrefix = '..';

const AWS_COMPREHEND_POSITIVE_TH = 0.8;
const AWS_COMPREHEND_NEGATIVE_TH = 0.8;

const GOOGLE_NLP_POSITIVE_TH = 0.7;
const GOOGLE_NLP_NEGATIVE_TH = -0.7;

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
  perform() {
    const oThis = this;

    const awsComprehendResult = oThis._calculateNPSForSentimentsFromAWSComprehend();

    const googleNLPResult = oThis._calculateNPSForSentimentsFromGoogleNLP();

    oThis.result.awsComprehend = awsComprehendResult || {};
    oThis.result.googleNLP = googleNLPResult || {};

    console.log('oThis.result==========', oThis.result);

    return oThis.result;
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
   * Calculate NPS for sentiments from Google nLP
   * @returns {{nps: number, totalTweets: number, detractorsCount: number, promotersCount: number}}
   * @private
   */
  _calculateNPSForSentimentsFromGoogleNLP() {
    const oThis = this;

    const googleNLPResult = {
      nps: 0,
      promotersCount: 0,
      detractorsCount: 0,
      totalTweets: oThis.totalTweetsCount
    };

    let promoters = 0,
      detractors = 0;
    for (let index = 0; index < oThis.sentimentsFromGoogleNLP.length; index++) {
      if (oThis.sentimentsFromGoogleNLP[index].score > GOOGLE_NLP_POSITIVE_TH) {
        promoters += 1;
      }

      if (oThis.sentimentsFromGoogleNLP[index].score < GOOGLE_NLP_NEGATIVE_TH) {
        detractors += 1;
      }
    }

    googleNLPResult.promotersCount = promoters;
    googleNLPResult.detractorsCount = detractors;
    googleNLPResult.nps = oThis._calculateNPS(promoters, detractors);

    return googleNLPResult;
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
