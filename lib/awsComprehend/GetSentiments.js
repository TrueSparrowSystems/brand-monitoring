const { BatchDetectSentimentCommand } = require('@aws-sdk/client-comprehend');

const rootPrefix = '../..',
  awsComprehendClientProvider = require(rootPrefix + '/lib/providers/awsComprehendClient');

class GetSentimentsViaAwsComprehend {
  constructor(documents) {
    const oThis = this;

    oThis.documents = documents;
    oThis.sentiments = [];
  }

  async perform() {
    const oThis = this;

    let startIndex = 0;
    const BATCH_SIZE = 25; // 25 max size is as per documentation - https://docs.aws.amazon.com/comprehend/latest/dg/API_BatchDetectSentiment.html

    while (startIndex < oThis.documents.length) {
      const batchDocuments = oThis.documents.slice(startIndex, startIndex + BATCH_SIZE);

      const client = awsComprehendClientProvider.getInstance();

      const input = { TextList: batchDocuments, LanguageCode: 'en' }; // TODO - assuming en here.

      const command = new BatchDetectSentimentCommand(input);
      const response = await client.send(command);

      const ResultList = response.ResultList;

      oThis.sentiments = oThis.sentiments.concat(ResultList);

      startIndex += BATCH_SIZE;
    }

    return oThis.sentiments;
  }
}

module.exports = GetSentimentsViaAwsComprehend;
