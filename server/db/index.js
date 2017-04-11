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
  entries: [{
    entry_type: String,
    created_at: {type: Date, default: Date.now},
    video_url: String,
    audio_url: String,
    text: String,
    watson_results: Object,
    tags: Array
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User: User
};

