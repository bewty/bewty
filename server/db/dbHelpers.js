const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const mongoDatabase = require('./index.js');
const User = mongoDatabase.User;
const Call = mongoDatabase.Call;

exports.userEntry = (req, res, userInfo) => {
  let newUser = User({
    user_id: userInfo.user_id,
    phonenumber: userInfo.phonenumber
  });
  newUser.save((err, results) => {
    if (err) {
      res.sendStatus(400).send(err);
    } else {
      res.sendStatus(201);
    }
  });
};

exports.saveEntry = (req, res, log) => {
  const userID = log.user_id;
  let logEntry = {
    entry_type: log.entry_type,
    created_at: Date.now(),
    video: {
      bucket: log.video ? log.video.bucket : null,
      key: log.video ? log.video.key : null,
      avg_data: log.video ? log.video.avgData : null,
      raw_data: log.video ? log.video.rawData : null,
    },
    audio: {
      bucket: log.audio ? log.audio.bucket : null,
      key: log.audio ? log.audio.key : null
    },
    text: log.text,
    watson_results: log.watson_results,
    tags: log.tags
  };

  User.findOneAndUpdate({user_id: userID}, {$push: {'entries': logEntry}}, {safe: true, upsert: false, new: true})

  .then((result) => {
    console.log('Entry successfully uploaded!');
    res.sendStatus(201);
  })
  .error(err => res.sendStatus(500).send(err))
  .catch(err => res.sendStatus(400).send(err));
};

exports.retrieveEntry = (query) => {
  let user_id = query.user_id || '01';
  return new Promise((resolve, reject) => {
    User.find({ user_id: user_id })
    .then((results) => {
      if (query.search === undefined) {
        resolve(JSON.stringify(results));
      } else {
        resolve(JSON.stringify(results[0][query.search]));
      }
    })
    .error((err) => {
      reject(err);
    });
  });
};

exports.modifyCall = (callInfo) => {
  let targetUser = callInfo.user_id;
  let newMessage = callInfo.message;
  let time = callInfo.time.replace(':', '');
  let oldTime = '';
  let user_id;
  return new Promise((resolve, reject) => {
    User.findOne({ user_id: targetUser })
    .then((user) => {
      console.log('Found user:', typeof targetUser, targetUser);
      console.log('number is:', user.phonenumber);
      oldTime = user.scheduled_time;
      user_id = user._id;
      user.scheduled_time = time;
      user.scheduled_message = newMessage;
      user.save();
    })
    .then(() => {
      return Call.findOne({ time: oldTime });
    })
    .then((call) => {
      if (call) {
        console.log('Length of call is:', call.user.length);
        if (call.user.length === 1 && call.user.indexOf(user_id) === 0) {
          console.log('Entered remove section:', call);
          call.remove();
        } else {
          console.log('Found splice:', call.user.indexOf(user_id));
          call.user.splice(call.user.indexOf(user_id), 1);
        }
        call.save();
      }
      return;
    })
    .then(() => {
      return Call.findOne({ time: time });
    })
    .then((call) => {
      console.log('Found target call:', call);
      if (!call) {
        let newCall = Call({
          time: time,
          user: [user_id]
        });
        newCall.save();
      } else {
        console.log('Call before push:', user_id, call.user);
        call.user.push(user_id);
        console.log('Call after push:', call.user);
        call.save();
      }
      return;
    })
    .then((result) => {
      let resolved = 'Successfully modified/saved scheduled call';
      resolve(resolved);
    })
    .catch(err => reject(err));
  });
};

exports.callEntry = (callInfo) => {
  let newCall = Call({
    time: callInfo.time,
    user: callInfo.user_id
  });
  return new Promise((resolve, reject) => {
    newCall.save()
    .then(function(success) {
      resolve(console.log(`${callInfo.user_id} scheduled call successfully added`));
    })
    .error(function(err) {
      reject(err);
    });
  });
};

exports.retrieveCall = (query) => {
  let time = query.time;
  return new Promise((resolve, reject) => {
    Call.findOne({time: time})
    .populate('user') 
    .exec((err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }  
    });
  });
};

exports.callList = () => {
  return new Promise((resolve, reject) => {
    Call.find(null, null, {sort: {time: 1}})
    .then((calls) => {
      resolve(calls);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

exports.findNextCall = (time) => {
  time = '' + time;
  return new Promise((resolve, reject) => {
    Call.find(null, null, {sort: {time: 1}})
    .populate('user') 
    .exec((err, calls) => {
      if (err) {
        reject(err);
      } else {
        resolve(calls);
      }  
    });
  })
  .then((calls) => {
    let nextCall;
    for (var i = 0; i < calls.length; i++) {
      if (calls[i].time === time) {
        i === calls.length - 1 ? nextCall = calls[0].time : nextCall = calls[i + 1].time;
      }
    }
    return nextCall;
  });
};

