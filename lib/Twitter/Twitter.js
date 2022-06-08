const rootPrefix = '../..',
  HttpRequest = require(rootPrefix + '/lib/HttpRequest'),
  twitterDeveloperLabsConstants = require(rootPrefix + '/lib/globalConstant/twitterDeveloperLabs');

const PLGWorksTwitterUserId = '1519609900564992004';

class TwitterWrapper {
  async getMentionedTweetsForUser(queryParams) {
    const oThis = this;

    const options = {
      resource: oThis._getMentionsRequestEndpoint(PLGWorksTwitterUserId),
      header: oThis._getHeader()
    };

    const requestParams = {
      max_results: queryParams.maxResults || 100,
      ['tweet.fields']: 'lang,author_id'
    };

    if (queryParams.startTime) {
      requestParams.start_time = queryParams.startTime;
    }

    if (queryParams.endTime) {
      requestParams.end_time = queryParams.endTime;
    }

    if (queryParams.paginationToken) {
      requestParams.pagination_token = queryParams.paginationToken;
    }

    const twitterMentionsResp = await new HttpRequest(options).get(requestParams);

    if (twitterMentionsResp.isFailure()) {
      return Promise.reject(twitterMentionsResp);
    }

    console.log('twitterMentionsResp -----------------', JSON.stringify(twitterMentionsResp));

    const responseData = JSON.parse(twitterMentionsResp.data.responseData);

    console.log('Twitter at mentions data ----- ', JSON.stringify(responseData));
  }

  /**
   * Get Request endpoint to get tweets
   *
   * @param id
   * @returns {string}
   * @private
   */
  _getMentionsRequestEndpoint(id) {
    return `https://api.twitter.com/2/users/${id}/mentions`;
  }

  /**
   * Get header information
   *
   * @private
   */
  _getHeader() {
    const oThis = this;

    return {
      Authorization: `Bearer ${twitterDeveloperLabsConstants.BEARER_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    };
  }
}

new TwitterWrapper().getMentionedTweetsForUser({});
// module.exports = new TwitterWrapper();
