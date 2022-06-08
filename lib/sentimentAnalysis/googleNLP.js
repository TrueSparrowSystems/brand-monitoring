const rootPrefix = '../..',
  googleNLPClient = require(rootPrefix + '/lib/providers/googleNLPClient');

/**
 * Class for google NLP methods.
 *
 * @class GoogleNLP
 */
class GoogleNLP {
  /**
   * Analyze sentiment of text.
   *
   * @param {string} text
   * @returns {Promise<void>}
   */
  async analyzeSentimentOfText(text) {
    // Creates a client
    const client = googleNLPClient.getInstance();

    // Prepares a document, representing the provided text
    const document = {
      content: text,
      type: 'PLAIN_TEXT'
    };

    // Detects the sentiment of the document
    const [result] = await client.analyzeSentiment({ document });

    const sentiment = result.documentSentiment;
    console.log('Document sentiment:');
    console.log(`  Score: ${sentiment.score}`);
    console.log(`  Magnitude: ${sentiment.magnitude}`);

    const sentences = result.sentences;
    sentences.forEach((sentence) => {
      console.log(`Sentence: ${sentence.text.content}`);
      console.log(`  Score: ${sentence.sentiment.score}`);
      console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
    });
  }
}
module.exports = new GoogleNLP();

const performer = new GoogleNLP();
const text =
  'This is hotel is the worst one. Staff are terrible. Front desk guys were worst and indifferent. I went with family and they have no consideration.';
performer.analyzeSentimentOfText(text);
