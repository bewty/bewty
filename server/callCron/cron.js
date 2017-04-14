const express = require('express');
const app = express();

const schedule = require('node-schedule');
const cronos = require('./cronHelpers.js');
const twilio = require('../twilioAPI/twilioAPI.js');

exports.scheduleCall = (info) => {
  let time = '' + info.wakeTime;
  let hour = time.slice(0, 2);
  let minute = time.slice(2, 4);
  let callList = info.callList;
  console.log('Received call to scheduleCall:', info);
  if (callList) {
    console.log('Got into callList with:', callList);
    callList.forEach((user) => {
      twilio.dialNumbers(user[0], user[1].replace(/ /g, '%20'));
    });
  }

  let scheduleTwilio = schedule.scheduleJob(`${minute} ${hour} * * *`, () => {
    console.log('Setting new schedule at:', hour, ':', minute);
    cronos.retrieveCalls(time)
    .then((callInfo) => {
      console.log('Received callInfo from retrieveCalls:', callInfo);
      exports.scheduleCall(callInfo);
    });
  });
};

