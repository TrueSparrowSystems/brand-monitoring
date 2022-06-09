const program = require('commander');

/**
 * Script to update expiry time for packages.
 *
 * @module executables/NPSCalculatorForTweets
 */

const rootPrefix = '..',
  GetMentionedTweetsForUserLib = require(rootPrefix + '/lib/Twitter/GetMentionedTweetsForUser'),
  GetSentimentsFromAWSComprehend = require(rootPrefix + '/lib/awsComprehend/GetSentiments'),
  GetSentimentsFromGoogleNLP = require(rootPrefix + '/lib/googleNLP/GetSentiments');

program.allowUnknownOption();
program.option('--startTime <startTime>', 'Start Timestamp').parse(process.argv);
program.option('--endTime <endTime>', 'End Timestamp').parse(process.argv);
program.option('--csvRequired <csvRequired>', 'CSV required(1/0)').parse(process.argv);

program.on('--help', function() {
  console.log('');
  console.log('  Example:');
  console.log('');
  console.log(' node executables/NPSCalculatorForTweets --startTime 1654759307 --endTime 1654413707 --csvRequired 1');
  console.log('');
});

const startTime = program.opts().startTime,
  endTime = program.opts().endTime,
  csvRequired = program.opts().csvRequired;

if (!startTime || !endTime || !csvRequired) {
  program.help();
  process.exit(1);
}

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

    oThis.processNextIteration = null;
  }

  /**
   * Perform
   *
   * @returns {Promise<void>}
   */
  async perform() {
    const oThis = this;

    oThis.processNextIteration = true;

    while (oThis.processNextIteration) {
      oThis.batchTweets = [];
      oThis.batchSentimentsForAWSComprehend = [];
      oThis.batchSentimentsFromGoogleNLP = [];

      await oThis._getTweetsForUser();

      await oThis._getSentimentAnalysisUsingAwsComprehend();

      await oThis._getSentimentAnalysisUsingGoogleNLP();

      oThis.allTweetsInDuration = oThis.allTweetsInDuration.concat(oThis.batchTweets);
      oThis.sentimentsFromAWSComprehend = oThis.allTweetsInDuration.concat(oThis.batchSentimentsForAWSComprehend);
      oThis.sentimentsFromGoogleNLP = oThis.allTweetsInDuration.concat(oThis.batchSentimentsFromGoogleNLP);
    }

    await oThis._calculateNPS();

    await oThis._writeDataToCsv();

    process.exit(0);
  }

  /**
   * Get Tweets for user.
   *
   * @sets oThis.batchTweets, oThis.processNextIteration
   *
   * @returns {Promise<void>}
   * @private
   */
  async _getTweetsForUser() {
    const oThis = this;

    const params = {
      twitterUserId: '1519609900564992004', // plgworks twitter user id
      maxResults: 5,
      startTime: oThis.startTime,
      endTime: oThis.endTime
    };

    if (oThis.twitterRequestMeta.next_token) {
      params.paginationToken = oThis.twitterRequestMeta.next_token;
    }

    const tweetsLibResponse = await new GetMentionedTweetsForUserLib(params).perform().catch(function(err) {
      console.log('err ----- ', err);
      // Todo: Add more handling to stop processing
    });

    oThis.batchTweets = tweetsLibResponse.data;
    oThis.twitterRequestMeta = tweetsLibResponse.meta;

    if (!oThis.twitterRequestMeta.next_token) {
      oThis.processNextIteration = false;
    }
  }

  /**
   * Get Sentiment Analysis Using AwsComprehend
   *
   * @sets oThis.batchSentimentsForAWSComprehend, oThis.sentimentsFromAWSComprehend
   * @returns {Promise<void>}
   * @private
   */
  async _getSentimentAnalysisUsingAwsComprehend() {
    const oThis = this;

    const sentimentsFromAWSComprehend = await new GetSentimentsFromAWSComprehend(oThis.batchTweets).perform();

    if (sentimentsFromAWSComprehend.length !== 0) {
      oThis.batchSentimentsForAWSComprehend = sentimentsFromAWSComprehend;
      oThis.sentimentsFromAWSComprehend = oThis.sentimentsFromAWSComprehend.concat(
        oThis.batchSentimentsForAWSComprehend
      );
    }

    console.log('sentimentsFromAWSComprehend ================', oThis.sentimentsFromAWSComprehend);
  }

  /**
   * Get Sentiment Analysis Using Google NLP
   *
   * @sets oThis.batchSentimentsFromGoogleNLP, oThis.sentimentsFromGoogleNLP
   *
   * @returns {Promise<void>}
   * @private
   */
  async _getSentimentAnalysisUsingGoogleNLP() {
    const oThis = this;

    const sentimentsFromGoogleNLP = await new GetSentimentsFromGoogleNLP(oThis.batchTweets).perform();

    if (sentimentsFromGoogleNLP.length !== 0) {
      oThis.batchSentimentsFromGoogleNLP = sentimentsFromGoogleNLP;
      oThis.sentimentsFromGoogleNLP = oThis.sentimentsFromGoogleNLP.concat(oThis.batchSentimentsFromGoogleNLP);
    }

    console.log('sentimentsFromGoogleNLP ================', oThis.sentimentsFromGoogleNLP);
  }

  /**
   * Calculate NPS for tweets
   *
   * @returns {Promise<void>}
   * @private
   */
  async _calculateNPS() {
    const oThis = this;
    // Return {google/Aws : NPS score, no. of promotors, no. of detractors, total no. of tweets}
  }

  async _writeDataToCsv() {
    const oThis = this;
  }
}

const performer = new NPSCalculatorForTweets({
  startTime: startTime,
  endTime: endTime,
  csvRequired: csvRequired
});

performer.perform().then(function(r) {
  console.log('Before exit:', r);
  process.exit(0);
});
