const database = require('./dbHelpers');

// let userInfo = {
//   name: 'Bob Test',
//   user_id: '02',
//   password: 'password',
//   phonenumber: '+14696826913'
// };

// let userInfo = {
//   name: 'Eugene Test',
//   user_id: '01',
//   password: 'password123',
//   phonenumber: '+17143389937'
// };

// database.userEntry(userInfo);

let callInfo = {
  user_id: '01',
  message: 'Whatatatatata jooojojojojaoososodlasod?',
  time: '1632'
};

database.modifyCall(callInfo);




