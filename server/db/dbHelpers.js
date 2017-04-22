const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const mongoDatabase = require('./index.js');
const User = mongoDatabase.User;
const Call = mongoDatabase.Call;
const ObjectId = mongoose.Types.ObjectId;

exports.userEntry = (req, res, userInfo) => {
  User.findOne({'phonenumber': userInfo.phonenumber})
  .then((user) => {
    if (user === null) {
      let newUser = User({
        phonenumber: userInfo.phonenumber,
        scheduled_time: '',
        scheduled_message: ''
      });
      newUser.save()
      .then((user) => {
        res.status(201).send(user);
      });
    } else {
      res.status(201).send(user);
    }
  })
  .catch((err) => {
    res.sendStatus(400);
  });
};

exports.saveEntry = (req, res, log) => {
  const _id = log.user_id;
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
  User.findOneAndUpdate({_id: _id}, {$push: {'entries': logEntry}}, {safe: true, upsert: false, new: true})
  .then((result) => {
    res.sendStatus(201);
  })
  .error(err => res.sendStatus(500).send(err))
  .catch(err => res.sendStatus(400).send(err));
};

exports.retrieveEntry = (query) => {
  let user_id = query.user_id;
  return new Promise((resolve, reject) => {
    User.aggregate([
      {$match: {_id: ObjectId(user_id)} },
      {$unwind: '$entries'},
      {$sort: {'entries.created_at': -1}},
      {$limit: 20 },
      {$project: {'entries.watson_results': 1, 'entries.text': 1, 'entries.entry_type': 1, 'entries.tags': 1, 'entries.video.avg_data': 1, 'entries.video.raw_data': 1, 'entries.created_at': 1}},
      {$group: {_id: '$_id', 'entries': {$push: '$entries'}}},
      {$project: {'entries': '$entries'}},
    ])
    .then( results => {
      if (results[0] === undefined) {
        resolve(results);
      } else {
        resolve(results[0].entries);
      }
    })
    .error((err) => {
      reject(err);
    });
  });
};

exports.retrieveEntryMedia = (query) => {
  let user_id = query.user_id;
  let entryId = query.entryId;
  return new Promise((resolve, reject) => {
    User.find({_id: user_id}, { entries: {$elemMatch: {_id: entryId}}, 'entries.audio': 1, 'entries.video.bucket': 1, 'entries.video.key': 1, 'entries._id': 1} )
    .then( (results) => {
      if (results[0] === undefined) {
        throw 'no entries found with entryId';
      } else {
        resolve(results[0].entries);
      }
    })
    .catch( err => {
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
    User.findOne({ _id: targetUser })
    .then((user) => {
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
        if (call.user.length === 1 && call.user.indexOf(user_id) === 0) {
          call.remove();
        } else {
          call.user.splice(call.user.indexOf(user_id), 1);
        }
        call.save();
      }
      return;
    })
    .then(() => {
      if (time === '') {
        let skip = 'skip';
        return skip;
      }
      return Call.findOne({ time: time });
    })
    .then((call) => {
      if (call === 'skip') {
        return call;
      }
      if (!call) {
        let newCall = Call({
          time: time,
          user: [user_id]
        });
        newCall.save();
      } else {
        call.user.push(user_id);
        call.save();
      }
      return;
    })
    .then((result) => {
      let resolved = 'Successfully modified/saved scheduled call';
      if (result === 'skip') {
        resolved = 'skip';
      }
      resolve(resolved);
    })
    .catch((err) => {
      reject(err);
    });
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
      // resolve(console.log(`${callInfo.user_id} scheduled call successfully added`));
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

exports.callEntry = (req, res, log) => {
  let _id = log.user_id;
  let question = log.message;
  let time = log.time;
  let logEntry = {
    question: question,
    responses: [],
    call_time: time
  };
  User.findOneAndUpdate({_id: _id}, {$push: {'call_entries': logEntry}}, {safe: true, upsert: false, new: true})
  .then((result) => {
    res.sendStatus(201);
  })
  .error(err => res.sendStatus(500).send(err))
  .catch(err => res.sendStatus(400).send(err));
};

exports.saveCall = (req, res, log) => {
  let phonenumber = log.phonenumber;
  logEntry = {
    text: log.text,
    watson_results: log.watson_results
  };
  User.findOne({phonenumber: phonenumber})
  .then((user) => {
    let lastIndex = user.call_entries.length - 1;
    user.call_entries[lastIndex].responses.push(logEntry);
    user.save();
  })
  .then(() => {
    res.sendStatus(200);
  })
  .error(err => res.sendStatus(500).send(err))
  .catch(err => res.sendStatus(400).send(err));
};

exports.retrievePhoneEntry = (req, res, log) => {
  let user = log.user;
  let query = log.search;
  User.findOne({_id: user})
  .then((user) => {
    console.log('Found user:', user.call_entries);
    res.status(200).send(JSON.stringify(user.call_entries));
  })
  .error(err => res.sendStatus(500).send(err))
  .catch(err => res.sendStatus(400).send(err));
};
