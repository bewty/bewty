require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/index');
const speech = require('./api/speech/speech');
const app = express();
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('file-system'));
const watson = require('./watsonAPI/watsonAPI.js');
const database = require('./db/dbHelpers');
const multer = require('multer');
const cors = require('cors');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const KEYS = require('../aws-config.js');
const s3 = new AWS.S3();
const upload = multer({
  dest: path.resolve(__dirname, 'api', 'speech', 'audio'),
  storage: multerS3({
    s3: s3,
    bucket: 'bewty',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname});
    },
    key: (req, file, cb) => cb(null, Date.now().toString())
  })
});

AWS.config.update({
  accessKeyId: KEYS.AWS_S3.ACCESS_KEY,
  secretAccessKey: KEYS.AWS_S3.SECRET_KEY,
  region: 'us-west-1'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '..', 'dist')));
app.use(require('morgan')('combined'));
app.use(cors());

app.get('/db/retrieveEntry/:user', (req, res) => {
  ///db/retrieveEntry/:user?query=entries
  let query = {};
  query.user = req.params.user || '123456789';
  query.search = req.query.query || 'entries';
  res.send(JSON.stringify(database.retrieveEntry(query)));
});

app.post('/db/userentry', (req, res) => {
  let userInfo = req.body.userInfo || {
    name: 'Bob Test',
    user_id: '123456789',
    password: 'password'
  };
  database.userEntry(userInfo);
  res.status(200).send(`${userInfo.name} successfuly added to database`);
});

app.post('/db/logentry', (req, res) => {
  let log = req.body.log || {
    user_id: '123456789',
    entry_type: 'Goal',
    audio_url: 'test.com/test',
    text: 'Testing for occurrence of missing data',
    watson_results: {Openness: {ReallyOpen: .67}},
    tags: ['Family', 'Work']
  };

  database.logEntry(log);
  res.status(200).send(`${log.user_id} entry updated successfuly`);
});

app.post('/api/watson', (req, res) => {
  let target = 'Ghandi.txt';
  let entry = req.body.text || `${__dirname}/watsonAPI/watsonTest/${target}`;

  fs.readFileAsync(entry, 'utf8')
  .then((results) => {
    return watson.promisifiedPersonality(results);
  })
  .then((results) => {
    res.status(200).send(results);
    return fs.writeFile(`./watsonAPI/watsonResults/${target}`, JSON.stringify(results));
  })
  .error(function(e) {
    console.log('Error received within post to /api/watson', e);
  });
});

app.post('/test', (req, res) => {
  console.log(req.body.test);
  res.send('hello world');
});

app.post('/newuser', (req, res) => {
  db.User.create({username: 'Brandon'})
  .then(result => {
    res.sendStatus(201);
  })
  .error(() => {
    res.sendStatus(500);
  })
  .catch(err => {
    res.sendStatus(400).send(err);
  });
});

app.get('/getusers', (req, res) => {
  db.User.find({})
  .then(result => {
    res.json(result);
  })
  .error(() => {
    res.sendStatus(500);
  })
  .catch(err => {
    res.sendStatus(400).send(err);
  });
});

app.post('/entry/audio', upload.single('audio'), (req, res) => {
  res.send('audio uploaded');
});

app.get('*', (req, res) => {
  res.sendFile( path.resolve(__dirname, '..', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on', port);
});