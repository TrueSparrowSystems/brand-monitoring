const program = require('commander');

/**
 * Script to update expiry time for packages.
 *
 * @module executables/NPSCalculatorForTweets
 */

const rootPrefix = '..',
  GetMentionedTweetsForUserLib = require(rootPrefix + '/lib/Twitter/GetMentionedTweetsForUser'),
  GetSentimentsFromAWSComprehend = require(rootPrefix + '/lib/awsComprehend/GetSentiments'),
  GetSentimentsFromGoogleNLP = require(rootPrefix + '/lib/googleNLP/GetSentiments'),
  GenerateTweetsAndSentimentsCSV = require(rootPrefix + '/lib/report/TweetSentiments'),
  NPSCalculatorLib = require(rootPrefix + '/lib/NPSCalculator'),
  CommonValidator = require(rootPrefix + '/lib/validators/Common');

program.allowUnknownOption();
program.option('--twitterUserId <csvRequired>', 'Twitter User Id').parse(process.argv);
program.option('--startTime <startTime>', 'Start Timestamp').parse(process.argv);
program.option('--endTime <endTime>', 'End Timestamp').parse(process.argv);
program.option('--csvRequired <csvRequired>', 'CSV required(1/0)').parse(process.argv);

program.on('--help', function() {
  console.log('');
  console.log('  Example:');
  console.log('');
  console.log(
    ' node executables/NPSCalculatorForTweets --twitterUserId 380749300  --startTime 1654759307 --endTime 1654413707 --csvRequired 1'
  );
  console.log('');
});

const twitterUserId = program.opts().twitterUserId,
  endTime = program.opts().endTime,
  csvRequired = Number(program.opts().csvRequired),
  startTime = program.opts().startTime;

// Todo Check against null and undefined
if (
  CommonValidator.isVarNullOrUndefined(twitterUserId) ||
  CommonValidator.isVarNullOrUndefined(startTime) ||
  CommonValidator.isVarNullOrUndefined(endTime) ||
  CommonValidator.isVarNullOrUndefined(csvRequired)
) {
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

    oThis.npsCalculationResponse = {};
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

      if (oThis.batchTweets.length == 0) {
        console.log(' --- No more tweets to process --- ');
        break;
      }

      await oThis._getSentimentAnalysisUsingAwsComprehend();

      await oThis._getSentimentAnalysisUsingGoogleNLP();

      oThis.allTweetsInDuration = oThis.allTweetsInDuration.concat(oThis.batchTweets);
      oThis.sentimentsFromAWSComprehend = oThis.sentimentsFromAWSComprehend.concat(
        oThis.batchSentimentsForAWSComprehend
      );
      oThis.sentimentsFromGoogleNLP = oThis.sentimentsFromGoogleNLP.concat(oThis.batchSentimentsFromGoogleNLP);
    }

    await oThis._calculateNPS();

    const csvFilePath = await oThis._writeDataToCsv();

    console.log('PATH TO CSV WITH ANALYSED RESULTS :: ', csvFilePath);
    console.log('NPS Data with AWS Comprehend :: ', JSON.stringify(oThis.npsCalculationResponse.awsComprehend));
    console.log('NPS Data with Google NLP :: ', JSON.stringify(oThis.npsCalculationResponse.googleNLP));

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
      // Todo : take twitter user id from command options.
      twitterUserId: '380749300', // plgworks twitter user id
      maxResults: 100,
      startTime: oThis.startTime,
      endTime: oThis.endTime
    };

    if (oThis.twitterRequestMeta.next_token) {
      params.paginationToken = oThis.twitterRequestMeta.next_token;
    }

    const tweetsLibResponse = await new GetMentionedTweetsForUserLib(params).perform().catch(function(err) {
      console.log('Error while Fetching Tweets :: --------- ', err);
    });

    const rawTweets = (tweetsLibResponse && tweetsLibResponse.data) || [];
    for (const tweetObj of rawTweets) {
      oThis.batchTweets.push(tweetObj.text);
    }

    oThis.twitterRequestMeta = (tweetsLibResponse && tweetsLibResponse.meta) || {};

    if (!oThis.twitterRequestMeta.next_token) {
      oThis.processNextIteration = false;
    }
  }

  /**
   * Get Sentiment Analysis Using AwsComprehend
   *
   * @sets oThis.batchSentimentsForAWSComprehend
   * @returns {Promise<void>}
   * @private
   */
  async _getSentimentAnalysisUsingAwsComprehend() {
    const oThis = this;

    const sentimentsFromAWSComprehend = await new GetSentimentsFromAWSComprehend(oThis.batchTweets)
      .perform()
      .catch(function(err) {
        console.log('Error while Fetching sentiments from Aws Comprehend :: --------- ', err);
      });

    if (sentimentsFromAWSComprehend.length !== 0) {
      oThis.batchSentimentsForAWSComprehend = sentimentsFromAWSComprehend;
    }

    console.log('sentimentsFromAWSComprehend ================', oThis.batchSentimentsForAWSComprehend);
  }

  /**
   * Get Sentiment Analysis Using Google NLP
   *
   * @sets oThis.batchSentimentsFromGoogleNLP
   *
   * @returns {Promise<void>}
   * @private
   */
  async _getSentimentAnalysisUsingGoogleNLP() {
    const oThis = this;

    // Todo :: Explore magnitude from response as well for calculating NPS.

    const sentimentsFromGoogleNLP = await new GetSentimentsFromGoogleNLP(oThis.batchTweets)
      .perform()
      .catch(function(err) {
        console.log('Error while Fetching sentiments from Google NLP :: --------- ', err);
      });

    if (sentimentsFromGoogleNLP.length !== 0) {
      oThis.batchSentimentsFromGoogleNLP = sentimentsFromGoogleNLP;
    }

    console.log('sentimentsFromGoogleNLP ================', oThis.batchSentimentsFromGoogleNLP);
  }

  /**
   * Calculate NPS for tweets
   *
   * @sets oThis.npsCalculationResponse
   *
   * @returns {Promise<void>}
   * @private
   */
  async _calculateNPS() {
    const oThis = this;

    const totalTweets = Number(oThis.allTweetsInDuration.length);

    oThis.npsCalculationResponse = await new NPSCalculatorLib(
      oThis.sentimentsFromAWSComprehend,
      oThis.sentimentsFromGoogleNLP,
      totalTweets
    ).perform();
  }

  /**
   * Writes analysed data to csv.
   *
   * @returns {Promise<void|*[]|never|[]>}
   * @private
   */
  async _writeDataToCsv() {
    const oThis = this;

    if (!oThis.csvRequired) {
      return;
    }

    const params = {
      tweets: oThis.allTweetsInDuration,
      sentimentsFromAWSComprehend: oThis.sentimentsFromAWSComprehend,
      sentimentsFromGoogleNLP: oThis.sentimentsFromGoogleNLP
    };

    return new GenerateTweetsAndSentimentsCSV(params).perform();
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
