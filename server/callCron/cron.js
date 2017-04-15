const express = require('express');
const app = express();
const database = require('../db/dbHelpers.js');
const schedule = require('node-schedule');
const cronos = require('./cronHelpers.js');
const twilio = require('../twilioAPI/twilioAPI.js');

exports.setCron = (time) => {
  let hour = time.slice(0, 2);
  let minute = time.slice(2, 4);
  schedule.scheduleJob(`0 ${minute} ${hour} * * *`, () => {
    database.retrieveCall({time: time})
    .then((call) => {
      return call.user.map((user) => {
        return [user.phonenumber, user.scheduled_message];
      });
    })
    .then((callLog) => {
      callLog.forEach((user) => {
        console.log('setCron() currently dialing:', user);
        twilio.dialNumbers(user[0], user[1].replace(/ /g, '%20'));
      });
    })
    .then(() => {
      exports.scheduleCall();
    });
  });
};

exports.scheduleCall = () => {
  let d = new Date();
  let currentTime = '' + d.getHours() + d.getMinutes();
  return new Promise((resolve, reject) => {
    database.callList()
    .then((calls) => {
      let callArray = calls.map((call) => {
        return call.time;
      });
      for (var i = 0; i < callArray.length; i++) {
        if (callArray[i] > currentTime) {
          return callArray[i];
        }
        if (i === callArray.length - 1) {
          return callArray[0];
        }
      }
    })
    .then((time) => {
      console.log('scheduleCall(): found next time to be:', time);
      exports.setCron(time);
      let resolved = `Set cron job for ${time}`;
      resolve(resolved);
    })
    .catch((err) => {
      reject(err);
    });
  });
};
