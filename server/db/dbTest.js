const database = require('./db/dbHelpers');

let userInfo = {
  name: 'Eugene Test',
  user_id: '01',
  password: 'password1',
  phonenumber: '+17143389937'
};
database.userEntry(userInfo);

// let callInfo = {
//   user_id: '01',
//   message: 'What good can I do today?',
//   time: 
// }