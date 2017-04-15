const database = require('../db/dbHelpers');

exports.retrieveCalls = (time) => {
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
      if ('' + nextTime === '' + time) {
        nextTime = nextTime - 1;
      }
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

