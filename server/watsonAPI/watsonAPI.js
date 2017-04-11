const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

//Watson personalityInsight
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

//Watson ToneAnalyzer
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const toneAnalyzer = new ToneAnalyzerV3({
 'username': process.env.TONE_ID,
 'password': process.env.TONE_PASS,
 'version_date': '2016-05-19'
});

exports.promisifiedTone = (text) => {
 return new Promise((resolve, reject) => {
   toneAnalyzer.tone({
     text: text
   }, (err, tone) => {
     if (err) {
       reject(err);
     } else {
       // console.log('......*****', JSON.stringify(tone, null, 2));
       resolve(JSON.stringify(tone, null, 2));
       // JSON.stringify(tone, null, 2));
     }
   });
 });
};