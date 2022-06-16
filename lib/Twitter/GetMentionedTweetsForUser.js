const rootPrefix = '../..',
  HttpRequest = require(rootPrefix + '/lib/HttpRequest'),
  configProvider = require(rootPrefix + '/lib/configProvider');

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
   * @param {number} [params.startTimestamp]   // Epoch Timestamp in seconds.
   * @param {number} [params.endTimestamp]     // Epoch Timestamp in seconds.
   * @param {string} [params.paginationToken]
   */
  constructor(params) {
    const oThis = this;

    oThis.startTimestamp = params.startTimestamp;
    oThis.endTimestamp = params.endTimestamp;
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

    if (oThis.startTimestamp) {
      requestParams.start_time = new Date(oThis.startTimestamp * 1000).toISOString();
    }

    if (oThis.endTimestamp) {
      requestParams.end_time = new Date(oThis.endTimestamp * 1000).toISOString();
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
      (oThis.startTimestamp && currentTimeStamp - oThis.startTimestamp > sevenDaysDurationInSecs) ||
      oThis.startTimestamp > currentTimeStamp
    ) {
      throw new Error('Incorrect Start time');
    }

    if (
      (oThis.endTimestamp && currentTimeStamp - oThis.endTimestamp > sevenDaysDurationInSecs) ||
      oThis.endTimestamp > currentTimeStamp
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
    const twitterApiConfig = configProvider.getConfig('twitterApiConfig');

    return {
      Authorization: `Bearer ${twitterApiConfig.bearerToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    };
  }
}

module.exports = GetMentionedTweetsForUser;
