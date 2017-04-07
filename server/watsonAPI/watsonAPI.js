const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

const personalityInsights = new PersonalityInsightsV3({
  'username': process.env.WATSON_ID,
  'password': process.env.WATSON_PASS,
  'version_date': '2016-10-19',
  headers: {
    'X-Watson-Learning-Opt-Out': true
  }
});

exports.promisifiedPersonality = (text) => {
  return new Promise((resolve, reject) => {
    personalityInsights.profile({
      text: text,
      consumption_preferences: true
    }, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
