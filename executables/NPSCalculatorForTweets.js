const program = require('commander');

/**
 * Script to update expiry time for packages.
 *
 * @module executables/NPSCaculatorForTweets.js
 */

const rootPrefix = '..',
  logger = require(rootPrefix + '/lib/logger/customConsoleLogger');

const limit = 50;

program.allowUnknownOption();
program.option('--startTime <startTime>', 'Start Timestamp').parse(process.argv);
program.option('--endTime <endTime>', 'endTimestamp').parse(process.argv);
program.option('--csvRequired <csvRequired>', 'CSV required(1/0)').parse(process.argv);

const startTime = program.opts().startTime,
  endTime = program.opts().endTime,
  csvRequired = program.opts().csvRequired;

class NPSCalculatorForTweets {
  /**
   * Constructor
   */
  constructor(params) {
    const oThis = this;

    oThis.startTime = params.startTime;
    oThis.endTime = params.endTime;
    oThis.csvRequired = params.csvRequired;

    oThis.allTweetsInDuration = [];
    oThis.sentimentsFromAWSComprehend = [];
    oThis.sentimentsFromGoogleNLP = [];

    oThis.batchTweets = [];
    oThis.batchSentimentsForAWSComprehend = [];
    oThis.batchSentimentsFromGoogleNLP = [];

    oThis.twitterRequestMeta = {};
  }

  /**
   * Perform
   *
   * @returns {Promise<void>}
   */
  async perform() {
    const oThis = this;
    let continueProcessing = 1;

    while (continueProcessing) {
      oThis.batchTweets = [];
      oThis.batchSentimentsForAWSComprehend = [];
      oThis.batchSentimentsFromGoogleNLP = [];

      await oThis._getTweetsForUser();

      if (oThis.batchTweets.length === 0) {
        break;
      }

      await oThis._getSentimentAnalysisUsingAwsComprehend();

      await oThis._getSentimentAnalysisUsingGoogleNLP();
    }

    await oThis._calculateNPS();

    await oThis._writeDataToCsv();

    process.exit(0);
  }

  async _getTweetsForUser() {
    const oThis = this;
  }

  async _getSentimentAnalysisUsingAwsComprehend() {
    const oThis = this;
  }

  async _getSentimentAnalysisUsingGoogleNLP() {
    const oThis = this;
  }

  async _calculateNPS() {
    const oThis = this;
    // Return {google/Aws : NPS score, no. of promotors, no. of detractors, total no. of tweets}
  }

  async _writeDataToCsv() {
    const oThis = this;
  }
}

const performer = new NPSCalculatorForTweets({
  startTime: oThis.startTime,
  endTime: oThis.endTime,
  csvRequired: oThis.csvRequired
});

performer.perform().then(function(r) {
  console.log('Before exit:', r);
  process.exit(0);
});
