const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const mongoDatabase = require('./index.js');
const User = mongoDatabase.User;

exports.userEntry = (userInfo) => {
  let newUser = User({
    name: userInfo.name,
    user_id: userInfo.user_id,
    password: userInfo.password
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
    video_url: log.video_url,
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



exports.retrieveEntry = (query) => {
  let targetUser = query.user || 'Bob Test';
  //If there is no specified search, fetch user object
  if (query.search === undefined) {
    User.find({ user_id: targetUser })
    .then(function(results) {
      console.log('Results for retrieveEntry within first if:', JSON.stringify(results));
      return JSON.stringify(results);
    })
    .catch(function(err) {
      console.log('Error occurred in if statement of retrieveEntry to db:', err);
    });
  } else {
    User.find({ user_id: targetUser })
    .then(function(results) {
      console.log('Results for retrieveEntry within else:', query.search, 'results:', JSON.stringify(results[0][query.search]));
      return JSON.stringify(results[0][query.search]);
    })
    .catch(function(err) {
      console.log('Error occurred in else statement of retrieveEntry to db:', err);
    });
  }
};