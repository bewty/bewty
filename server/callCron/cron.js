const express = require('express');
const app = express();
const database = require('../db/dbHelpers.js');
const schedule = require('node-schedule');
const cronos = require('./cronHelpers.js');
const twilio = require('../twilioAPI/twilioAPI.js');
const moment = require('moment-timezone');

exports.setCron = (time) => { 
  let wakeTime = moment(time, 'HHmm').add(7, 'hours').format('HHmm');
  let hour = wakeTime.slice(0, 2);
  let minute = wakeTime.slice(2, 4);
  schedule.scheduleJob(`0 ${minute} ${hour} * * *`, () => {
    database.retrieveCall({time: time})
    .then((call) => {
      return call.user.map((user) => {
        return [user.phonenumber, user.scheduled_message];
      });
    })
    .then((callLog) => {
      callLog.forEach((user) => {
        twilio.dialNumbers(user[0], user[1].replace(/ /g, '%20'));
      });
    })
    .then(() => {
      setTimeout(() => {
        exports.scheduleCall();
      }, 5000);
    })
    .catch((err) => {
      console.log('Received err in cron/setCron:', err);
    });
  });
};

exports.scheduleCall = () => {
  let d = new Date();
  let hour = ('' + d.getHours()).length === 1 ? `0${d.getHours()}` : '' + d.getHours();
  let minute = ('' + d.getMinutes()).length === 1 ? `0${d.getMinutes()}` : '' + d.getMinutes();
  let currentTime = moment.tz(Date.now(), 'America/Los_Angeles').format('HHmm');
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
      console.log(`Set cron job for ${time}`);
      exports.setCron(time);
    })
    .then(() => {
      let resolved = 'Call scheduled';
      resolve(resolved);

    })
    .catch((err) => {
      reject(err);
    });
  });
};
