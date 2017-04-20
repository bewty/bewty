const mongoose = require('mongoose');
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
      entry_type: { type: String, default: 'phone'},
      text: String,
      created_at: {type: Date, default: Date.now},
      watson_results: String
    }]
  }]
});

const callSchema = new mongoose.Schema({
  time: {type: String},
  user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

const Call = mongoose.model('Call', callSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
  Call: Call
};


