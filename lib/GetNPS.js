const rootPrefix = '..',
  GetMentionedTweetsForUserLib = require(rootPrefix + '/lib/Twitter/GetMentionedTweetsForUser'),
  GetSentimentsFromAWSComprehend = require(rootPrefix + '/lib/awsComprehend/GetSentiments'),
  NPSCalculatorLib = require(rootPrefix + '/lib/NPSCalculator'),
  CommonValidator = require(rootPrefix + '/lib/validators/Common'),
  awsComprehendConstant = require(rootPrefix + '/lib/globalConstant/awsComprehend');

/**
 * Class to get NPS.
 *
 * @class GetNPSForTweets
 */
class GetNPSForTweets {
  /**
   * Constructor to get NPS.
   *
   * @param {object} params
   * @param {number} params.twitterUserId
   * @param {number} params.startTime
   * @param {number} params.endTime
   */
  constructor(params) {
    const oThis = this;

    oThis.twitterUserId = params.twitterUserId;
    oThis.startTime = params.startTime;
    oThis.endTime = params.endTime;

    oThis.allTweetsInDuration = [];
    oThis.sentimentsFromAWSComprehend = [];

    oThis.batchTweets = [];
    oThis.batchSentimentsForAWSComprehend = [];

    oThis.batchLanguageToTweetsMap = {};
    oThis.twitterRequestMeta = {};
    oThis.processNextIteration = null;

    oThis.npsCalculationResponse = {};
  }

  /**
   * Perform
   *
   * @returns {Promise<void>}
   */
  async perform() {
    const oThis = this;

    oThis._validateParams();

    oThis.processNextIteration = true;

    while (oThis.processNextIteration) {
      oThis.batchTweets = [];
      oThis.batchSentimentsForAWSComprehend = [];
      oThis.batchLanguageToTweetsMap = {};

      await oThis._getTweetsForUser();

      await oThis._getSentimentAnalysisUsingAwsComprehend();

      if (oThis.batchTweets.length == 0) {
        console.log(' --- No more tweets to process --- ');
        break;
      }

      oThis.allTweetsInDuration = oThis.allTweetsInDuration.concat(oThis.batchTweets);
      oThis.sentimentsFromAWSComprehend = oThis.sentimentsFromAWSComprehend.concat(
        oThis.batchSentimentsForAWSComprehend
      );
    }

    await oThis._calculateNPS();

    console.log('NPS Data with AWS Comprehend :: ', JSON.stringify(oThis.npsCalculationResponse));

    return oThis.npsCalculationResponse;
  }

  /**
   * Validate params
   *
   * @returns {Promise<never>}
   * @private
   */
  _validateParams() {
    const oThis = this;

    if (
      CommonValidator.isVarNullOrUndefined(oThis.twitterUserId) ||
      CommonValidator.isVarNullOrUndefined(oThis.startTime) ||
      CommonValidator.isVarNullOrUndefined(oThis.endTime)
    ) {
      throw new Error('Invalid input parameter.Please ensure the input is well formed.');
    }
  }

  /**
   * Get Tweets for user.
   *
   * @sets oThis.batchTweets, oThis.processNextIteration
   *
   * @returns {Promise<void>}
   * @private
   */
  async _getTweetsForUser() {
    const oThis = this;

    const params = {
      twitterUserId: oThis.twitterUserId,
      maxResults: 100,
      startTime: oThis.startTime,
      endTime: oThis.endTime
    };

    if (oThis.twitterRequestMeta.next_token) {
      params.paginationToken = oThis.twitterRequestMeta.next_token;
    }

    const tweetsLibResponse = await new GetMentionedTweetsForUserLib(params).perform().catch(function(err) {
      console.log('Error while Fetching Tweets :: --------- ', err);
    });

    const rawTweets = (tweetsLibResponse && tweetsLibResponse.data) || [],
      awsComprehendSupportedLanguages = awsComprehendConstant.awsComprehendSupportedLanguages;
    for (const tweetObj of rawTweets) {
      const tweetLanguage = tweetObj.lang;

      if (awsComprehendSupportedLanguages.includes(tweetLanguage)) {
        oThis.batchLanguageToTweetsMap[tweetLanguage] = oThis.batchLanguageToTweetsMap[tweetLanguage] || [];
        oThis.batchLanguageToTweetsMap[tweetLanguage].push(tweetObj.text);
      }
    }

    oThis.twitterRequestMeta = (tweetsLibResponse && tweetsLibResponse.meta) || {};

    if (!oThis.twitterRequestMeta.next_token) {
      oThis.processNextIteration = false;
    }
  }

  /**
   * Get Sentiment Analysis Using AwsComprehend
   *
   * @sets oThis.batchSentimentsForAWSComprehend
   * @returns {Promise<void>}
   * @private
   */
  async _getSentimentAnalysisUsingAwsComprehend() {
    const oThis = this;

    for (const tweetLanguage in oThis.batchLanguageToTweetsMap) {
      const documents = oThis.batchLanguageToTweetsMap[tweetLanguage];
      const sentimentsFromAWSComprehend = await new GetSentimentsFromAWSComprehend(documents, tweetLanguage)
        .perform()
        .catch(function(err) {
          console.log('Error while Fetching sentiments from Aws Comprehend :: --------- ', err);
        });

      if (sentimentsFromAWSComprehend.length !== 0) {
        oThis.batchTweets = oThis.batchTweets.concat(documents);
        oThis.batchSentimentsForAWSComprehend = oThis.batchSentimentsForAWSComprehend.concat(
          sentimentsFromAWSComprehend
        );
      }
    }
  }

  /**
   * Calculate NPS for tweets
   *
   * @sets oThis.npsCalculationResponse
   *
   * @returns {Promise<void>}
   * @private
   */
  async _calculateNPS() {
    const oThis = this;

    const totalTweets = Number(oThis.allTweetsInDuration.length);

    oThis.npsCalculationResponse = await new NPSCalculatorLib(oThis.sentimentsFromAWSComprehend, totalTweets).perform();
  }
}

module.exports = GetNPSForTweets;
