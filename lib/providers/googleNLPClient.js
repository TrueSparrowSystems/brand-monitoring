const GoogleCloudLanguage = require('@google-cloud/language');

const rootPrefix = '../..';

let client = null;

class GoogleNLPClient {
  getInstance() {
    if (client) return client;

    client = new GoogleCloudLanguage.LanguageServiceClient();

    return client;
  }
}

module.exports = new GoogleNLPClient();
