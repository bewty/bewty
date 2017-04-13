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
//   user_id: '02',
//   message: 'What good can I do today?',
//   time: '20:00'
// };
// console.log('Sending...:', callInfo);
// database.modifyCall(callInfo);

let retrieveCalls = (time) => {
  return new Promise((resolve, reject) => {
    database.retrieveCall({time: time})
    .then((call) => {
      resolve(call.user.map((user) => {
        return [user.phonenumber, user.scheduled_message];
      }));
    })
    .catch((err) => {
      reject(err);
    });
  });
};

// retrieveCalls(1400)
// .then((results) => {
//   console.log('Received calls:', results);
// });

