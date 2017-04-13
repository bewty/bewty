const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/bewty');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to mongoDB');
});

const userSchema = new mongoose.Schema({
  name: String,
  user_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phonenumber: { type: String, required: true},
  scheduled_time: String,
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
    tags: Array,
  }]
});

const callSchema = new mongoose.Schema({
  time: String,
  user: [{type: String, ref: 'User'}]
});

const Call = mongoose.model('Call', callSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
  Call: Call
};




