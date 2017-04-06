const express = require('express');

const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

const personalityInsights = new PersonalityInsightsV3({
  /* username, password, version, etc... */
  // 'url': 'https://gateway.watsonplatform.net/personality-insights/api',
  'username': process.env.WATSON_ID,
  'password': process.env.WATSON_PASS,
  'version_date': '2016-10-19',
  headers: {
    'X-Watson-Learning-Opt-Out': true
  }
});

// personalityInsights.profile = personalityInsights.profile({
//   text: 'Enter more than 100 unique words here...',
//   consumption_preferences: true
//   },
//   function (err, response) {
//     if (err)
//       console.log('error:', err);
//     else
//       console.log(JSON.stringify(response, null, 2));
// });

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
