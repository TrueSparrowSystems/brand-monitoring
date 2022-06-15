# Brand-monitoring

Brand Monitor helps you understand your twitter audience better. This module provides you with a number of promoters, number of detractors, [Net Promoter Score (NPS)](https://en.wikipedia.org/wiki/Net_promoter_score) and the total number of tweets within a particular time frame.

## Approach

Using [twitter api](https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-mentions), we gather the tweet mentions of a particular account. These tweets are within the given time period.

We get the sentiments of these tweets using [AWS Comprehend](https://docs.aws.amazon.com/comprehend/latest/dg/API_BatchDetectSentiment.html). Based on these sentiments we find out the stats.

For a large dataset of tweets and their sentiments given by AWS Comprehend, we manually analysed each tweet data and accordingly set the thresholds for sentiment score for deciding who is a promoter and who is a detractor.

## Prerequisites
- You will need a Twitter developer account and you should have created a Twitter App.
- You will also need an AWS account.

## Install NPM

```shell script
npm install @plgworks/brand-monitoring --save
```

## Initialize
```js
const BrandMonitoring = require('@plgworks/brand-monitoring');

const twitterApiConfig = {
  bearer_token: '<bearer_token>'
};

const awsComprehendConfig = {
  region: '<region>',
  access_key_id: '<access_key_id>',
  secret_access_key: '<secret_access_key>'
};

const brandmonitoring = new BrandMonitoring(twitterApiConfig, awsComprehendConfig);
```

### Initialization Params
**1. `twitterApiConfig`** is an object which contains bearer token.

- **bearer_token**: It is used to have a more secure point of entry for using the Twitter APIs, and can be obtained from the developer portal inside the keys and tokens section of your App's settings.

**2. `awsComprehendConfig`** is an object which contains AWS Comprehend access credentials.

- **region**: It is the AWS region.
- **access_key_id**: AWS uses this to verify your identity and grant or deny you access to specific resources.
- **secret_access_key**: AWS uses this to verify your identity and grant or deny you access to specific resources.
<br>

### Get Statistics

```js
const reportParams = {
  twitterUserId: '<twitter_user_id>',
  startTimestamp: '<start_timestamp>',
  endTimestamp: '<end_timestamp>'
};

brandmonitoring.getStats(reportParams);
```

**`reportParams`** is an object which contains the twitter account id and the duration.
- **twitterUserId**: It is the account id of the twitter handle of which you want to generate the stats. You can find your twitter id using this [twitter API](https://developer.twitter.com/en/docs/labs/tweets-and-users/api-reference/get-users-by-username). 
- **startTimestamp**: It is the start timestamp of the duration in which you want to calculate the statistics.
- **endTimestamp**: It is the end timestamp of the duration in which you want to calculate the statistics.
<br>

