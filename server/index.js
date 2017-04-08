const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/index');
const speech = require('./api/speech/speech');
const app = express();
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

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '..', 'dist')));
app.use(require('morgan')('combined'));

app.get('/test', (req, res) => {
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