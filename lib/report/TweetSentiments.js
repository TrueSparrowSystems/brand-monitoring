const fs = require('fs'),
  csvWriter = require('csv-write-stream');

const rootPrefix = '../..',
  basicHelper = require(rootPrefix + '/lib/helpers/basic');

/**
 * Class to generate csv for tweets and their sentiments.
 *
 * @Class TweetSentimentsReport
 */
class TweetSentimentsReport {
  /**
   * Constructor to generate csv for tweets and their sentiments.
   *
   * @param params
   */
  constructor(params) {
    const oThis = this;

    oThis.tweets = params.tweets;
    oThis.sentimentsFromAWSComprehend = params.sentimentsFromAWSComprehend;
    oThis.sentimentsFromGoogleNLP = params.sentimentsFromGoogleNLP;

    oThis.currentTimestampInSeconds = basicHelper.getCurrentTimestampInSeconds();
    oThis.fileName = `tweets_and_sentiments_report_${oThis.currentTimestampInSeconds}.csv`;
    const fileDir = `./reports`;
    oThis.filePath = `${fileDir}/${oThis.fileName}`;
  }

  /**
   * Main performer of class.
   *
   * @returns {Promise<void>}
   */
  async perform() {
    const oThis = this;

    await oThis._createFile();

    await oThis._addDataToCsv();

    return oThis.filePath;
  }

  /**
   * Create file and its headers.
   *
   * @sets oThis.writer
   *
   * @private
   */
  async _createFile() {
    const oThis = this;

    basicHelper.ensureDirectoryExistence(oThis.filePath);

    oThis.writer = csvWriter({ headers: oThis.rowKeys, separator: ',' });
    oThis.writer.pipe(fs.createWriteStream(oThis.filePath));

    console.log(`Local file: ${oThis.filePath} created`);
  }

  /**
   * Get row keys.
   *
   * @returns {string[]}
   */
  get rowKeys() {
    return [
      'Tweet',
      'AWS sentiment',
      'AWS Positive score',
      'AWS Negative score',
      'AWS Neutral score',
      'AWS Mixed score',
      'Google NLP sentiment score'
    ];
  }

  /**
   * Add data to CSV.
   *
   * @private
   */
  async _addDataToCsv() {
    const oThis = this;

    console.log('This.tweets', oThis.tweets);

    for (let index = 0; index < oThis.tweets.length; index++) {
      console.log('oThis.tweets[index] --- ', oThis.tweets[index]);
      console.log(
        'oThis.sentimentsFromAWSComprehend[index] --- ',
        JSON.stringify(oThis.sentimentsFromAWSComprehend[index])
      );
      console.log('oThis.sentimentsFromGoogleNLP[index] --- ', JSON.stringify(oThis.sentimentsFromGoogleNLP[index]));

      const row = [
        oThis.tweets[index],
        oThis.sentimentsFromAWSComprehend[index].Sentiment,
        oThis.sentimentsFromAWSComprehend[index].SentimentScore.Positive,
        oThis.sentimentsFromAWSComprehend[index].SentimentScore.Negative,
        oThis.sentimentsFromAWSComprehend[index].SentimentScore.Neutral,
        oThis.sentimentsFromAWSComprehend[index].SentimentScore.Mixed,
        oThis.sentimentsFromGoogleNLP[index].score
      ];

      oThis.writer.write(row);
      await basicHelper.sleep(10);
    }
    oThis.writer.end();
  }
}

module.exports = TweetSentimentsReport;
