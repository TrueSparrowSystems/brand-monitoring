const { ComprehendClient } = require('@aws-sdk/client-comprehend');

const rootPrefix = '../..',
  configProvider = require(rootPrefix + '/lib/configProvider');

let client = null;

class AwsComprehendClientProvider {
  /**
   * Get Instance
   *
   * @returns {ComprehendClient|*}
   */
  getInstance() {
    if (client) return client;

    const awsComprehendConfig = configProvider.getConfig('awsComprehendConfig');

    client = new ComprehendClient({
      region: awsComprehendConfig.region,
      credentials: {
        accessKeyId: awsComprehendConfig.access_key_id,
        secretAccessKey: awsComprehendConfig.secret_access_key
      }
    });

    return client;
  }
}

module.exports = new AwsComprehendClientProvider();
