const rootPrefix = '../..';

class TwitterDeveloperLabsConstant {
  get BEARER_TOKEN() {
    return process.env.BM_TWITTER_BEARER_TOKEN;
  }
}

module.exports = new TwitterDeveloperLabsConstant();
