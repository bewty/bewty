const express = require('express');
const app = express();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


exports.dialNumbers = (number, message) => {
  client.calls.create({
    url: `https://handler.twilio.com/twiml/EHbfb96ad7bafedf5e02460070a5bae8e7?message=${message}`,
    to: number,
    from: '+19498294984',
    transcribe: true
  }, (err, call) => {
    if (err) {
      console.log('Error occurred in twilioAPI clientCall:', err);
    } else {
      console.log('TwilioAPI making call to:', call.to);
    }
  });
};


