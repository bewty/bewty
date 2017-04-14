const cron = require('node-cron');
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

exports.scheduleCall = (message) => {
  var now = new Date();
  var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;
  if (millisTill10 < 0) {
    millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
  }
  setInterval(() => { alert('Its 10am!'); }, millisTill10);
};

//{ callList: [ [ '+13232290550', 'What good can I do today?' ] ], wakeTime: '2359' }

exports.scheduleCall = (info) => {
  // '23 18 * * *'
  // let date = new Date(2012, 11, 21, 5, 30, 0);
  // cronos.retrieveCalls()
  let j = schedule.scheduleJob('24 * * * *', function() {
    console.log('Testing cron.');
  });
};

scheduleCall();