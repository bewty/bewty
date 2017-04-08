const twilio = require('twilio');

// var SID = 'ACd5868f24e65bcbef726b2f775ef32e4b';
// var auth = '9694e9889bfb7f9c15ae0510a581792c';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

client.calls.create({
  url: 'http://demo.twilio.com/docs/voice.xml',
  to: process.env.TWILIO_TO,
  from: '+19498294984'
}, function(err, call) {
  if (err) {
    console.log('Error occurred in twilioAPI clientCall:', err);
  } else {
    console.log(call.sid);
  }
});