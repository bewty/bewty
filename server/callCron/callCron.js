const database = require('./dbHelpers');

// let userInfo = {
//   name: 'Bob Test',
//   user_id: '02',
//   password: 'password',
//   phonenumber: '+123456789'
// };

// let userInfo = {
//   name: 'Eugene Test',
//   user_id: '01',
//   password: 'password123',
//   phonenumber: process.env.TWILIO_TO
// }
// database.userEntry(userInfo);

// let callInfo = {
//   user_id: '01',
//   message: 'What good can I do today?',
//   time: '05:00'
// };
// console.log('Sending...:', callInfo);
// database.modifyCall(callInfo);

let sendCalls = () => {
  let calls = [];
  database.retrieveCall({time: '0500'})
  .then((call) => {
    console.log('Received call:', call.user);
  })
};