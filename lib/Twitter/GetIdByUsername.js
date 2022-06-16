const rootPrefix = '../..',
  HttpRequest = require(rootPrefix + '/lib/HttpRequest'),
  configProvider = require(rootPrefix + '/lib/configProvider');

/**
 * Class for getting twitter id for given username.
 *
 * @class GetIdByUsername
 */
class GetIdByUsername {
  /**
   * Constructor for getting twitter id for given username.
   *
   * @param twitterUsername
   */
  constructor(twitterUsername) {
    const oThis = this;

    oThis.twitterUserName = twitterUsername;
    oThis.responseData = {};
  }

  /**
   * Main performer of the class.
   *
   * @returns {Promise<{}|*>}
   */
  async perform() {
    const oThis = this;

    const options = {
      resource: oThis._getIdByUserNameRequestEndpoint(oThis.twitterUserName),
      header: oThis._getHeader()
    };

    const requestParams = { 'tweet.fields': 'id' };

    await oThis._getId(options, requestParams);

    return oThis.responseData;
  }

  /**
   * Send request to get twitter id.
   *
   * @param {*} options
   * @param {*} requestParams
   *
   * @sets oThis.responseData
   *
   * @returns {Promise<void>}
   */
  async _getId(options, requestParams) {
    const oThis = this;

    const twitterResp = await new HttpRequest(options).get(requestParams);

    if (twitterResp.isFailure()) {
      return Promise.reject(twitterResp);
    }

    oThis.responseData = JSON.parse(twitterResp.data.responseData);
  }

  /**
   * Get Request endpoint to get tweets.
   *
   * @param twitterUserName
   * @returns {string}
   * @private
   */
  _getIdByUserNameRequestEndpoint(twitterUserName) {
    return `https://api.twitter.com/2/users/by/username/${twitterUserName}`;
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

module.exports = GetIdByUsername;
