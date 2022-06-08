const { ComprehendClient } = require('@aws-sdk/client-comprehend');

const rootPrefix = '../..',
  awsComprehendConstant = require(rootPrefix + '/lib/globalConstant/awsComprehend');

let client = null;

class AwsComprehendClientProvider {
  /**
   * Get Instance
   *
   * @returns {ComprehendClient|*}
   */
  getInstance() {
    if (client) return client;

    client = new ComprehendClient({
      region: awsComprehendConstant.REGION,
      credentials: {
        accessKeyId: awsComprehendConstant.ACCESS_KEY_ID,
        secretAccessKey: awsComprehendConstant.SECRET_ACCESS_KEY
      }
    });

    return client;
  }
}

module.exports = new AwsComprehendClientProvider();
