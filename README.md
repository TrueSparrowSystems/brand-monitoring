# brand-monitoring

## Using AWS Comprehend
```js
const documents = [
'The service was good but the food served was not fresh',
'Not satisfied with the quality of food.'
];

const rootPrefix = '.';
const GetSentimentsViaAwsComprehend = require(rootPrefix + '/lib/awsComprehend/GetSentiments');
new GetSentimentsViaAwsComprehend(documents).perform().then(function(r){console.log(JSON.stringify(r, null, 2))});
```

