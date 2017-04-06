const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/bewty');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connected to mongoDB');
});

const userSchema = new mongoose.Schema({
  username: String
});

const User = mongoose.model('User', userSchema);

module.exports = {
  db: db,
  User: User
};
