const { BatchDetectSentimentCommand } = require('@aws-sdk/client-comprehend');

const rootPrefix = '../..',
  awsComprehendClient = require(rootPrefix + '/lib/providers/awsComprehendClient');

/**
 * Class for AWS comprehend methods.
 *
 * @class AWSComprehend
 */
class AWSComprehend {
  /**
   * Detect batch sentiment.
   *
   * @param {array<string>} input
   * @returns {Promise<void>}
   */
  async detectBatchSentiment(input) {
    // Creates a client
    const client = awsComprehendClient.getInstance();
    const command = new BatchDetectSentimentCommand({ TextList: input, LanguageCode: 'en' });
    const response = await client.send(command);

    console.log('response--->', JSON.stringify(response, null, 2));
  }
}
module.exports = new AWSComprehend();
