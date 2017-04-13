const database = require('../db/dbHelpers');

// let userInfo = {
//   name: 'Eugene Test',
//   user_id: '01',
//   password: 'password123',
//   phonenumber: 'process.env.TWILIO_TO'
// };

// let userInfo = {
//   name: 'Tim Test',
//   user_id: '02',
//   password: 'password123',
//   phonenumber: process.env.TWILIO_T
// }

// let userInfo = {
//   name: 'Whitney Test',
//   user_id: '03',
//   password: 'password',
//   phonenumber: 'process.env.TWILIO_W'
// };


// let userInfo = {
//   name: 'Brandon Test',
//   user_id: '04',
//   password: 'password123',
//   phonenumber: process.env.TWILIO_B
// }
// database.userEntry(userInfo);


// let callInfo = {
//   user_id: '04',
//   message: 'What good can I do today?',
//   time: '23:59'
// };
// console.log('Sending...:', callInfo);
// database.modifyCall(callInfo);

let retrieveCalls = (time) => {
  let wakeTime;
  let callList;
  return new Promise((resolve, reject) => {
    database.retrieveCall({time: time})
    .then((call) => {
      return call.user.map((user) => {
        return [user.phonenumber, user.scheduled_message];
      });
    })
    .then((callLog) => {
      callList = callLog;
      return database.findNextCall(time);
    })
    .then((nextTime) => {
      wakeTime = nextTime;
    })
    .then(() => {
      resolve({callList, wakeTime});
    })
    .catch((err) => {
      reject(err);
    });
  });
};




