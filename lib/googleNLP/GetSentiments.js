const rootPrefix = '../..',
  googleNLPClient = require(rootPrefix + '/lib/providers/googleNLPClient');

/**
 *  Class to get sentiments by Google NLP
 *
 * @class GetSentimentsViaGoogleNLP
 */
class GetSentimentsViaGoogleNLP {
  /**
   * Constructor to get sentiments by Google NLP
   *
   * @param {array<string>}documents
   */
  constructor(documents) {
    const oThis = this;

    oThis.documents = documents;
    oThis.sentiments = [];
  }

  /**
   * Performer for class
   *
   * @returns {Promise<[]|*[]>}
   */
  async perform() {
    const oThis = this;

    let startIndex = 0;
    const BATCH_SIZE = 25;

    while (startIndex < oThis.documents.length) {
      const batchDocuments = oThis.documents.slice(startIndex, startIndex + BATCH_SIZE);
      const client = googleNLPClient.getInstance();

      let promises = [];
      for (let index = 0; index < batchDocuments.length; index++) {
        const document = {
          content: batchDocuments[index],
          type: 'PLAIN_TEXT'
        };

        // Todo:: Handle rate limit exceptions
        promises.push(client.analyzeSentiment({ document }));
      }

      const promisesResponse = await Promise.all(promises);
      const currentBatchSentimentsArray = [];

      for (let index = 0; index < promisesResponse.length; index++) {
        const documentResponse = promisesResponse[index];
        const documentSentiment = documentResponse[0].documentSentiment;
        currentBatchSentimentsArray.push(documentSentiment);
      }

      oThis.sentiments = oThis.sentiments.concat(currentBatchSentimentsArray);

      startIndex += BATCH_SIZE;
    }

    console.log('sentiments==========', JSON.stringify(oThis.sentiments));
    return oThis.sentiments;
  }
}

module.exports = GetSentimentsViaGoogleNLP;
