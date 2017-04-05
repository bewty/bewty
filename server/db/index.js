var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bewty');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connected to mongoDB');
});

var userSchema = new mongoose.Schema({
  username: String
});

var User = mongoose.model('User', userSchema);

module.exports = {
  db: db,
  User: User
};
