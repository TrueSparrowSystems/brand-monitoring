# Brand-monitoring

Brand Monitor helps you understand your twitter audience better. This module provides you with a number of promoters, number of detractors, Net Promoter Score (NPS) and the total number of tweets within a particular time frame.

## Approach

Using [twitter api](https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-mentions), we gather the tweet mentions of a particular account. These tweets are within the given time period.

We get the sentiments of these tweets using [AWS Comprehend](https://docs.aws.amazon.com/comprehend/latest/dg/API_BatchDetectSentiment.html). Based on these sentiments we find out the stats.

For a large dataset of tweets and their sentiments given by AWS Comprehend, we manually analysed each tweet data and accordingly set the thresholds for sentiment score for deciding who is a promoter and who is a detractor.

## Prerequisites

## Install NPM

```shell script
npm install @plgworks/brand-monitoring --save
```

## Initialize
```js
const twitterUserId = '<twitter user id>'; // TODO comment here.
const startTimestamp = 1234; // TODO comment here.
const endTimestamp = 1234; // TODO comment here.

const BrandMonitoring = require('@plgworks/brand-monitoring');
const brandmonitoring = new BrandMonitoring(twitterUserId, startTimestamp, endTimestamp);
```

### Initialization Params
**1. `twitterUserId`** is the user id of the twitter account of which you want to calculate the statistics. TODO

**2. `startTimestamp`** is the start time of the duration in which you want to calculate the statistics.

**3. `endTimestamp`** is the end time of the duration in which you want to calculate the statistics. 

### Get Statistics

```js
brandmonitoring.getStats();
```
