require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const db = require('./db/index');
const speech = require('./api/speech/speech');
const app = express();
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('file-system'));
const watson = require('./watsonAPI/watsonAPI.js');
const database = require('./db/dbHelpers');
const twilio = require('./twilioAPI/twilioAPI.js');
const cors = require('cors');
const AWS = require('aws-sdk');
const axios = require('axios');
const querystring = require('querystring');
const multerS3 = require('multer-s3');
const s3 = new AWS.S3();
const cron = require('./callCron/cron.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '..', 'dist')));
app.use(require('morgan')('combined'));
app.use(cors());

app.post('/cron/start', (req, res) => {
  let startTime = req.body.time || 1634;

  cron.scheduleCall({wakeTime: startTime});
  res.send('Sent to scheduleCall');
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname});
    },
    key: (req, file, cb) => cb(null, Date.now().toString())
  })
});

const getAWSSignedUrl = (req) => {
  const params = {
    Bucket: 'smartdiarybewt',
    Key: req.file.key
  };
  return s3.getSignedUrl('getObject', params);
};

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: 'us-west-1'
});

app.post('/scheduleCall', (req, res) => {
  let time = req.body.time;
  let question = req.body.question;
  console.log('Received scheduleCall post:', time.replace(':', ''), question);
  res.status(200).send('Successfuly scheduled call');
});

app.post('/db/retrieveEntry', (req, res) => {
  ///db/retrieveEntry/:user?query=entries
  let query = {};
  query.user_id = req.body.user_id || '01';
  query.search = req.body.search;
  database.retrieveEntry(query)
  .then((results) => {
    res.send(results);
  });
});

app.post('/db/userentry', (req, res) => {
  let userInfo = req.body.userInfo || {
    user_id: '01',
    phonenumber: '1231231234'
  };
  database.userEntry(userInfo);
  res.status(200).send(`${phonenumber} successfuly added to database`);
});

app.post('/transcribe', (req, res) => {
  console.log('Within /transcribe with:', req.body.TranscriptionText);
  let text = req.body.TranscriptionText || 'Test123123';
  // let callSid = req.body.CallSid;
  let textID = req.body.textID || 'transcribeTest';
  let user_id = req.body.user_id || '01';
  watson.promisifiedTone(text)
  .then((tone) => {
    console.log('Received tone entry:', tone);
    let log = {
      user_id: user_id,
      text: text,
      watson_results: tone
    };
    database.saveEntry(log);
  })
});

app.post('/api/watson', (req, res) => {
  let target = 'Ghandi.txt';
  let entry = req.body.text || `${__dirname}/watsonAPI/watsonTest/${target}`;

  fs.readFileAsync(entry, 'utf8')
  .then((results) => {
    return watson.promisifiedPersonality(results);
  })
  .then((results) => {
    return fs.writeFile(`./watsonAPI/watsonResults/${target}`, JSON.stringify(results));
    res.status(200).send(results);
  })
  .error(function(e) {
    console.log('Error received within post to /api/watson', e);
  });
});

app.post('/test', (req, res) => {
  watson.promisifiedTone('Hello, my name is bob and I like to eat carrots but only on Tuesday')
  .then((tone) => {
    console.log('Received get to /test:', tone);
    res.send(tone);
  });
});

app.post('/entry', upload.single('media'), (req, res) => {
  watson.promisifiedTone(req.body.text)
  .then(tone => {
    let log = {
      user_id: '123456789', // NOTE: hardcode user id
      entry_type: req.body.entryType,
      video: {
        bucket: req.file ? req.file.bucket : null,
        key: req.file ? req.file.key : null,
        avgData: req.body.avgData ? req.body.avgData : null,
        rawData: req.body.rawData ? req.body.rawData : null,
      },
      audio: {
        bucket: req.file ? req.file.bucket : null, // should be same as video later
        key: req.file ? req.file.key : null,
      },
      text: req.body.text,
      watson_results: tone
    };
    database.saveEntry(req, res, log);
  });
});

app.get('*', (req, res) => {
  res.sendFile( path.resolve(__dirname, '..', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on', port);
});
