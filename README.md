# Brand-monitoring

Brand Monitor helps you understand your twitter audience better. This module provides you with a Net Promoter Score(nps), total number of tweets, as well as number of promoters and detractors within a particular time frame.

## Why Brand-Monitoring?

- Brand-monitoring gives you an in depth insight of the twitter mentions of your brand. 

- It can be used to monitor how people respond to your service or product. 

- It can also be used to understand customer satisfaction.

## Approach

Using [twitter api](https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-mentions), we gather the tweet mentions of a particular account. These tweets are within the given time period.

We get the sentiments of these tweets related to the account using [AWS Comprehend](https://docs.aws.amazon.com/comprehend/latest/dg/API_BatchDetectSentiment.html); based on these sentiments we obtain the NPS, number of promoter and detractors, and total number of tweets.
We calculate the NPS as %promoters - %detractors.

For a large dataset of tweets and their sentiments given by AWS Comprehend, we analysed each tweet data and accordingly we set the thresholds for promoters and detractors.

## Prerequisites

## Install NPM

```shell script
npm install @plgworks/brand-monitoring
```

## Initialize
```
const BrandMonitoring = require('@plgworks/brand-monitoring');
const brandmonitoringObj = new BrandMonitoring(twitterUserId, startTimestamp, endTimestamp);
```

### Initialization Params
**1. `twitterUserId`** is the user id of the twitter account of which you want to calculate the NPS.

**2. `startTimestamp`** is the start time of the duration in which you want to calculate the NPS.

**3. `endTimestamp`** is the end time of the duration in which you want to calculate the NPS. 

### Get NPS
```
brandmonitoringObj.getNPS();
```
