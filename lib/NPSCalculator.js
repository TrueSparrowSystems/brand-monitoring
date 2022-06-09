const rootPrefix = '..';

/**
 *  Class to calculate NPS percentage
 *
 * @class NPSCalculator
 */
class NPSCalculator {
  /**
   * Constructor calculate NPS percentage
   *
   * @param {array<objects>} sentimentsFromAWSComprehend
   * @param {array<objects>} sentimentsFromGoogleNLP
   */
  constructor(sentimentsFromAWSComprehend, sentimentsFromGoogleNLP) {
    const oThis = this;

    oThis.sentimentsFromGoogleNLP = sentimentsFromGoogleNLP;
    oThis.sentimentsFromGoogleNLP = sentimentsFromGoogleNLP;
    oThis.result = {};
  }

  /**
   * Performer for class
   *
   * @returns {Promise<[]|*[]>}
   */
  async perform() {
    const oThis = this;

    await oThis._calculateNPSForSentimentsFromAWSComprehend();

    await oThis._calculateNPSForSentimentsFromGoogleNLP();
  }

  async _calculateNPSForSentimentsFromAWSComprehend() {
    const oThis = this;
  }

  async _calculateNPSForSentimentsFromGoogleNLP() {
    const oThis = this;
  }
}

module.exports = NPSCalculator;
