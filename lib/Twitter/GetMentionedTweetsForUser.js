const rootPrefix = '../..',
  HttpRequest = require(rootPrefix + '/lib/HttpRequest'),
  twitterDeveloperLabsConstants = require(rootPrefix + '/lib/globalConstant/twitterDeveloperLabs');

/**
 * Class for getting tweets of specified user.
 *
 * @class GetMentionedTweetsForUser
 */
class GetMentionedTweetsForUser {
  /**
   * Constructor for mentioned tweets for user.
   *
   * @param {object} params
   * @param {string} params.twitterUserId
   * @param {number} [params.maxResults]
   * @param {number} [params.startTime]   // Epoch Timestamp in seconds.
   * @param {number} [params.endTime]     // Epoch Timestamp in seconds.
   * @param {string} [params.paginationToken]
   */
  constructor(params) {
    const oThis = this;

    oThis.startTime = params.startTime;
    oThis.endTime = params.endTime;
    oThis.maxResults = params.maxResults || 100;
    oThis.paginationToken = params.paginationToken || null;
    oThis.twitterUserId = params.twitterUserId;
    oThis.responseData = {};
  }

  /**
   * Main performer of the class.
   *
   * @returns {Promise<void | never>}
   */
  async perform() {
    const oThis = this;

    await oThis._allConstraintsValid();

    const options = {
      resource: oThis._getMentionsRequestEndpoint(oThis.twitterUserId),
      header: oThis._getHeader()
    };

    const requestParams = oThis._getRequestParams();

    await oThis._getTweets(options, requestParams);

    oThis._filterNonEnglishTweets();

    return oThis.responseData;
  }

  /**
   * Send request for getting tweets.
   *
   * @param {*} options
   * @param {*} requestParams
   *
   * @returns {Promise<void>}
   */
  async _getTweets(options, requestParams) {
    const oThis = this;

    const twitterMentionsResp = await new HttpRequest(options).get(requestParams);

    if (twitterMentionsResp.isFailure()) {
      return Promise.reject(twitterMentionsResp);
    }
    oThis.responseData = JSON.parse(twitterMentionsResp.data.responseData);

    // Todo :: Remove filter on lang: en, consumer will handle different languages
    console.log('Twitter at mentions data ----- ', JSON.stringify(oThis.responseData));
  }

  /**
   * Sets request params.
   *
   * @returns {*}
   * @private
   */
  _getRequestParams() {
    const oThis = this;

    const requestParams = {
      max_results: oThis.maxResults,
      'tweet.fields': 'lang,author_id'
    };

    if (oThis.startTime) {
      requestParams.start_time = new Date(oThis.startTime * 1000).toISOString();
    }

    if (oThis.endTime) {
      requestParams.end_time = new Date(oThis.endTime * 1000).toISOString();
    }

    if (oThis.paginationToken) {
      requestParams.pagination_token = oThis.paginationToken;
    }

    return requestParams;
  }

  /**
   * Checks if params are valid.
   *
   * @returns {*}
   * @private
   */
  _allConstraintsValid() {
    const oThis = this;

    const currentTimeStamp = Math.floor(Date.now() / 1000);

    const sevenDaysDurationInSecs = 604800;

    if (!oThis.twitterUserId) {
      throw new Error('Twitter user id is mandatory parameter');
    }

    if (
      (oThis.startTime && currentTimeStamp - oThis.startTime > sevenDaysDurationInSecs) ||
      oThis.startTime > currentTimeStamp
    ) {
      throw new Error('Incorrect Start time');
    }

    if (
      (oThis.endTime && currentTimeStamp - oThis.endTime > sevenDaysDurationInSecs) ||
      oThis.endTime > currentTimeStamp
    ) {
      throw new Error('Incorrect end time');
    }

    if (oThis.maxResults < 5 || oThis.maxResults > 100) {
      throw new Error('Incorrect max results value');
    }

    return true;
  }

  /**
   * Get Request endpoint to get tweets.
   *
   * @param id
   *
   * @returns {string}
   * @private
   */
  _getMentionsRequestEndpoint(id) {
    return `https://api.twitter.com/2/users/${id}/mentions`;
  }

  /**
   * Get header information.
   *
   * @private
   */
  _getHeader() {
    return {
      Authorization: `Bearer ${twitterDeveloperLabsConstants.BEARER_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    };
  }

  /**
   * Filters non english tweets.
   *
   * @returns {void}
   * @private
   */
  _filterNonEnglishTweets() {
    const oThis = this;

    const dataArray = oThis.responseData.data,
      filteredArray = [];
    for (let index = 0; index < dataArray.length; index++) {
      if (dataArray[index].lang == 'en') {
        filteredArray.push(dataArray[index]);
      }
    }

    oThis.responseData.data = filteredArray;
  }
}

module.exports = GetMentionedTweetsForUser;
