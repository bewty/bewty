const elasticsearch = require('elasticsearch');
const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const moment = require('moment-timezone');
mongoose.Promise = require('bluebird');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/bewty');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to mongoDB');
});

const client = new elasticsearch.Client({
  host: process.env.BONSAI_URL,
  log: 'trace'
});

const responseSchema = new mongoose.Schema({
  user_id: String,
  phonenumber: String,
  text: String,
  created_at: {type: Date, default: moment.tz(Date.now(), 'America/Los_Angeles').format()},
  entry_type: {type: String, default: 'audio'},
  watson_results: String
});


const userSchema = new mongoose.Schema({
  user_id: String,
  phonenumber: { type: String, required: true, unique: true},
  scheduled_time: { type: String, default: '' },
  scheduled_message: String,
  aggregated_entries: { type: String, default: '' },
  entries: [{
    entry_type: String,
    created_at: {type: Date, default: moment.tz(Date.now(), 'America/Los_Angeles').format()},
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
    date_set: {type: Date, default: moment.tz(Date.now(), 'America/Los_Angeles').format()},
    responses: [{
      text: String,
      created_at: {type: Date, default: moment.tz(Date.now(), 'America/Los_Angeles').format()},
      entry_type: {type: String, default: 'audio'},
      watson_results: String
    }]
  }]
});

const callSchema = new mongoose.Schema({
  time: {type: String},
  user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

responseSchema.plugin(mongoosastic, {
  esClient: client
});

const Response = mongoose.model('Response', responseSchema);
const Call = mongoose.model('Call', callSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
  Call: Call,
  Response: Response
};
