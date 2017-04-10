const express = require('express');
const app = express();

const twilio = require('twilio');
const twilioAPI = require('twilio-api');
const cli = new twilioAPI.Client(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.use(cli.middleware() );

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const phoneNumbers = {
  'Eugene': '+17143389937', 
  'Tim': '+13232290550', 
  'Whitney': '+14152157254',
  'Brandon': '+14696826913', 
  'Gary': '+14086428264'
};


exports.dialNumbers = (number, name) => {
  client.calls.create({
    url: `https://handler.twilio.com/twiml/EHbfb96ad7bafedf5e02460070a5bae8e7?Name=${name}`,
    to: number,
    from: '+19498294984',
    // record: true,
    transcribe: true,
    // transcribeCallback: 'http://8f6dd1df.ngrok.io/transcribe',
    // recordingStatusCallbackMethod: 'POST'
    transcribeCallback: 'http://8f6dd1df.ngrok.io/transcribe'
  }, function(err, call) {
    if (err) {
      console.log('Error occurred in twilioAPI clientCall:', err);
    } else {
      console.log('Twilio SID:', call.sid, 'uri:', call.uri, 'else:', call);
    }
  });
};

// dialNumbers('+17143389937', 'Eugene');

// for (const number in phoneNumbers) {
//   dialNumbers(phoneNumbers[number], number);
// }
