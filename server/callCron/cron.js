const express = require('express');
const app = express();

const schedule = require('node-schedule');
const cronos = require('./cronHelpers.js');
const twilio = require('../twilioAPI/twilioAPI.js');
// cron.schedule('* * * * *', function() {
//   console.log('running a task every minute');
// });
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    |
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

//{ callList: [ [ '+13232290550', 'What good can I do today?' ] ], wakeTime: '2359' }

exports.scheduleCall = (info) => {
  let time = info.wakeTime;
  let hour = info.wakeTime.slice(0, 2);
  let minute = info.wakeTime.slice(2, 4);
  let callList = info.callList;
  console.log('Received call to scheduleCall:', info);
  if (callList) {
    console.log('Got into callList with:', callList);
    callList.forEach((user) => {
      twilio.dialNumbers(user[0], 'Person');
    });
  }
  // '23 18 * * *'
  // let date = new Date(2012, 11, 21, 5, 30, 0);
  // cronos.retrieveCalls()
  //    twilio.dialNumbers('+17143389937', 'Eugene');

  let scheduleTwilio = schedule.scheduleJob(`${minute} ${hour} * * *`, () => {
    console.log('Setting new schedule at:', hour, ':', minute);
    cronos.retrieveCalls(time)
    .then((callInfo) => {
      console.log('Received callInfo from retrieveCalls:', callInfo);
      exports.scheduleCall(callInfo);
    });
  });
};

