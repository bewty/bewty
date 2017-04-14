const express = require('express');
const app = express();

const twilio = require('twilio');

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const phoneNumbers = process.env.PHONENUMBERS;


exports.dialNumbers = (number, name) => {
  client.calls.create({
    url: `https://handler.twilio.com/twiml/EHbfb96ad7bafedf5e02460070a5bae8e7?Name=${name}`,
    to: number,
    from: '+19498294984',
    // record: true,
    transcribe: true,
    // recordingStatusCallbackMethod: 'POST'
    transcribeCallback: 'http://08dcb0a2.ngrok.io/transcribe'
  }, function(err, call) {
    if (err) {
      console.log('Error occurred in twilioAPI clientCall:', err);
    } else {
      console.log('Twilio SID:', call.sid, 'uri:', call.uri, 'else:', call);
    }
  });
};


