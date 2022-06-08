const rootPrefix = '../..';

class AwsComprehendConstant {
  get REGION() {
    return process.env.BM_AWS_COMPREHEND_REGION;
  }

  get ACCESS_KEY_ID() {
    return process.env.BM_AWS_COMPREHEND_ACCESS_KEY_ID;
  }

  get SECRET_ACCESS_KEY() {
    return process.env.BM_AWS_COMPREHEND_SECRET_ACCESS_KEY;
  }
}

module.exports = new AwsComprehendConstant();
