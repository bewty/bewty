const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const mongoDatabase = require('./index.js');
const User = mongoDatabase.User;

exports.userEntry = (userInfo) => {
  let newUser = User({
    name: userInfo.name,
    user_id: userInfo.user_id,
    password: userInfo.password,
    phonenumber: userInfo.phonenumber
  });

  newUser.save()
  .then(function(success) {
    return console.log(`${newUser.name} successfully added`);
  })
  .catch(function(err) {
    console.log('Error occurred in userEntry to db:', err);
  });
};

exports.logEntry = (log) => {
  const userID = log.user_id;
  let logEntry = {
    entry_type: log.entry_type,
    created_at: Date.now(),
    video: {
      bucket: log.video.bucket,
      key: log.video.key,
      avg_data: log.video.avgData,
      raw_data: log.video.rawData,
    },
    audio_url: log.audio_url,
    text: log.text,
    watson_results: log.watson_results,
    tags: log.tags
  };

  User.findOneAndUpdate({user_id: userID}, {$push: {'entries': logEntry}}, {safe: true, upsert: false, new: true},
    function(err, model) {
      if (err) {
        console.log('Error occurred in logEntry to db:', err);
      } else {
        console.log(`successfully added ${logEntry.userID} entry:`, model);
      }
    });
};

exports.logVideoEntry = (req, res, log) => {
  const userID = log.user_id;
  let logEntry = {
    entry_type: log.entry_type,
    created_at: Date.now(),
    video: {
      bucket: log.video.bucket,
      key: log.video.key,
      avg_data: log.video.avgData,
      raw_data: log.video.rawData,
    },
    text: log.text,
    watson_results: log.watson_results,
  };

  User.findOneAndUpdate({user_id: userID}, {$push: {'entries': logEntry}}, {safe: true, upsert: false, new: true})

  .then((result) => {
    console.log('Video successfully uploaded!', result);
    res.sendStatus(201);
  })
  .error(err => res.sendStatus(500).send(err))
  .catch(err => res.sendStatus(400).send(err));
};

exports.logAudioEntry = (req, res, log) => {
  const userID = log.user_id;
  let logEntry = {
    created_at: Date.now(),
    audio: {
      bucket: log.audio.bucket,
      key: log.audio.key
    },
    text: log.text,
    watson_results: log.watson_results
  };

  User.findOneAndUpdate({user_id: userID}, {$push: {'entries': logEntry}}, {safe: true, upsert: false, new: true})

  .then((result) => {
    console.log('Audio successfully uploaded!', result);
    res.sendStatus(201);
  })
  .error(err => res.sendStatus(500).send(err))
  .catch(err => res.sendStatus(400).send(err));
};


exports.retrieveEntry = (query) => {
  let targetUser = query.user || 'Bob Test';
  return new Promise((resolve, reject) => {
    User.find({ user_id: targetUser })
    .then((results) => {
      if (query.search === undefined) {
        resolve(JSON.stringify(results));
      } else {
        resolve(JSON.stringify(results[0][query.search]));
      }
    })
    .catch((err) => {
      reject(err);
    });
  });
};

exports.modifyCall = (callInfo) => {
  let targetUser = callInfo.user_id;
  let newMessage = callInfo.message;
  let time = callInfo.time.replace(':', '');
  let oldTime = '';
  User.find({ user_id: targetUser })
  .then((user) => {
    oldTime = user.scheduled_time;
    user.scheduled_time = time;
    user.scheduled_message = newMessage;
  })
  .then(() => {
    Call.find({ time: oldTime });
  })
  .then((time) => {
    call.user.splice(call.user.indexOf(targetUser), 1);
  })
  .then(() => {
    Call.find({ time: time });
  })
  .then((time) => {
    time.user.push(targetUser);
  })
  .catch((err) => {
    console.log('Error occurred within modifyCall to db:', err);
  });

};

exports.callEntry = (callInfo) => {
  let newCall = Call({
    time: callInfo.time,
    user: callInfo.user_id
  });

  newCall.save()
  .then(function(success) {
    return console.log(`${callInfo.user_id} scheduled call successfully added`);
  })
  .catch(function(err) {
    console.log('Error occurred in callEntry to db:', err);
  });
};

exports.retrieveCall = (query) => {
  let time = query.time;
  Call.find({time: time})
  .populate('schedule', 'name', 'scheduled_message')
  .exec((err, user) => {
    if (err) {
      return handleError(err);
    } else {
      console.log('Saved users are:', call.schedule.name, 'scheduled message:', call.schedule.scheduled_message);
    }
  });
};
