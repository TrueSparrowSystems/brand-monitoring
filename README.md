# Brand Monitoring
![npm version](https://img.shields.io/npm/v/@plgworks/brand-monitoring.svg?style=flat)

Brand Monitor helps you understand your twitter audience better. This module provides you with number of promoters & detractors, [Net Promoter Score (NPS)](https://en.wikipedia.org/wiki/Net_promoter_score) and the total number of tweets within a particular time duration.

## Approach

Using [Twitter API](https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-mentions), we gather the tweet mentions of a particular account. These tweets are within the given time duration.

We get the sentiments of these tweets using [AWS Comprehend](https://docs.aws.amazon.com/comprehend/latest/dg/API_BatchDetectSentiment.html). Based on these sentiments, we find out the stats.

## Prerequisites
- [Twitter Developer App](https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api)
- [AWS Comprehend](https://docs.aws.amazon.com/comprehend/index.html)

## Install

```shell script
npm install @plgworks/brand-monitoring --save
```

## Initialize
```js
const BrandMonitoring = require('@plgworks/brand-monitoring');

const twitterApiConfig = {
  bearerToken: '<bearerToken>'
};

const awsComprehendConfig = {
  region: '<region>',
  accessKeyId: '<accessKeyId>',
  secretAccessKey: '<secretAccessKey>'
};

const brandmonitoring = new BrandMonitoring(twitterApiConfig, awsComprehendConfig);
```

### Initialization Params
**1. `twitterApiConfig`** is an object which has following key(s).

- **bearerToken**: It is used to have a more secure point of entry to use Twitter APIs, and can be obtained from the developer portal inside the keys and tokens section of your Twitter App's settings.

**2. `awsComprehendConfig`** is an object which contains AWS Comprehend access credentials. It has following keys.

- **region**: It is the AWS region.
- **accessKeyId**: AWS uses this to verify your identity and grant or deny you access to specific resources.
- **secretAccessKey**: AWS uses this to verify your identity and grant or deny you access to specific resources.
<br>

## Get Statistics
Once the Brand Monitoring module is initialized, the next step is to perform sentimental analysis on tweets.

```js
const reportParams = {
  twitterUserId: '<twitterUserId>',
  startTimestamp: '<startTimestamp>',
  endTimestamp: '<endTimestamp>',
  awsThreshold: {
    positive: '<positive>',
    negative: '<negative>'
  }
};

const stats = await brandmonitoring.getStats(reportParams);
```

**`reportParams`** is an object with following keys.
- **twitterUsername**: Twitter username for which you want to generate the stats. Example: @PLGWorks
- **startTimestamp**: Start timestamp used to search tweets
- **endTimestamp**: End timestamp used to search tweets
- **awsThreshold**: (Optional) It is an object which contains AWS Comprehend sentiment score threshold values. Default positive value is 0.55 and negative value is 0.40
  - **positive**: Range is from 0 to 1. If sentiment is positive and the sentiment score is greater than this threshold, then we consider the tweet as positive (i.e. promoter).
  - **negative**: Range is from 0 to 1. If sentiment is negative and the sentiment score is greater than this threshold, then we consider the tweet as negative (i.e. detractor).

## Success Response



## Error Handling
