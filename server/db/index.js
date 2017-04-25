const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

mongoose.Promise = require('bluebird');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/bewty');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to mongoDB');
});

const userSchema = new mongoose.Schema({
  user_id: String,
  phonenumber: { type: String, required: true, unique: true},
  scheduled_time: { type: String, default: '' },
  scheduled_message: String,
  entries: [{
    entry_type: String,
    created_at: {type: Date, default: Date.now},
    video: {
      bucket: String,
      key: String,
      avg_data: Object,
      raw_data: Array,
    },
    audio: {
      bucket: String,
      key: String
    },
    text: String,
    watson_results: String,
    tags: Array
  }],
  call_entries: [{
    question: String,
    call_time: String,
    date_set: {type: Date, default: Date.now},    
    responses: [{
      text: String,
      created_at: {type: Date, default: Date.now},
      entry_type: {type: String, default: 'audio'},
      watson_results: String
    }]
  }]
});

const callSchema = new mongoose.Schema({
  time: {type: String},
  user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

userSchema.plugin(mongoosastic);

const Call = mongoose.model('Call', callSchema);
const User = mongoose.model('User', userSchema);

// User.createMapping(function(err, mapping) {  
//   if (err) {
//     console.log('error creating mapping (you can safely ignore this)');
//     console.log(err);
//   } else {
//     console.log('mapping created!');
//     console.log(mapping);
//   }
// });

module.exports = {
  User: User,
  Call: Call
};


