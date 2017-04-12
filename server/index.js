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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '..', 'dist')));
app.use(require('morgan')('combined'));
app.use(cors());

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

let videoId;
const uploadVideo = multer({
  dest: path.resolve(__dirname, '..', 'dist','upload'),
  storage: multerS3({
    s3: s3,
    bucket: 'smartdiarybewt',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname});
    },
    key: (req, file, cb) => cb(null, `${Date.now().toString()}.webm`)
  }),
});

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: path.resolve(__dirname, '..', 'dist', 'upload'),
//     filename: (req, file, cb) => cb(null, `${file.originalname}-${Date.now().toString()}.webm`),
//     limits: { fileSize: 100000 },
//   })
// });

const getAWSSignedUrl = (req) => {
  const params = {
    Bucket: 'smartdiarybewt',
    Key: req.file.key
  };
  return s3.getSignedUrl('getObject', params);
};

const karios = axios.create({
  baseURL: 'https://api.kairos.com',
  headers: {
    'app_id': process.env.KAIROS.APP_ID,
    'app_key': process.env.KAIROS.APP_KEY
  }
});

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

app.post('/call', (req, res) => {
  let number = req.body.number || process.env.TWILIO_TO;
  let name = req.body.name || 'Eugene';
  console.log('Received post to /call:', name, ':', number);
  twilio.dialNumbers(number, name);
  res.status(200).send('Successfuly called');
});


app.post('/db/retrieveEntry', (req, res) => {
  ///db/retrieveEntry/:user?query=entries
  let query = {};
  query.user = req.body.user || '123456789';
  query.search = req.body.query || 'entries';
  database.retrieveEntry(query)
  .then((results) => {
    res.send(results);
  });
});

app.post('/db/userentry', (req, res) => {
  let userInfo = req.body.userInfo || {
    name: 'Bob Test',
    user_id: '123456789',
    password: 'password',
    phonenumber: '1231231234'
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

app.post('/transcribe', (req, res) => {
  console.log('Received post to /transcribe:', req.body);
  let text = req.body.TranscriptionText;
  // let callSid = req.body.CallSid;
  let textID = req.body.textID || 'transcribeTest';
  let divider = '\n------------------------------------\n';
  watson.promisifiedTone(text)
  .then((tone) => {
    fs.writeFile(`./server/watsonAPI/watsonResults/${textID}`, text + divider + tone);
  })
  .then((results) => {
    console.log('Successfuly transcribed:', text);
    res.send('Successfuly transcribed');
  });
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

app.post('/entry/audio', upload.single('audio'), (req, res) => {
  res.send('audio uploaded');
});

////GET request within POST
// kairosGetResult = (req, res) => {
//   return karios.get(`/v2/analytics/${req.videoId}`)
//   .then( res => {
//     return res.data;
//     res.send(res.data);
//   });
// };

app.post('/entry/video', upload.single('video'), (req, res) => {

  console.log('amazon link', req.file.location);

  ////aws presigned url
  // const url = getAWSSignedUrl(req);
  const url = req.file.location; //aws public link
  return karios.post(`/v2/media?source=${url}`)
  .then( postRes => {
    console.log('karios POST COMPLETED:===', postRes.data);

    //GET results with a button
    videoId = postRes.data.id;

    ////GET result within POST
    // req.videoId = postRes.data.id;
    // return kairosGetResult(req, res);
  })
  .then( result => {
    console.log('/entry/video COMPELTE=====', result);
    res.send(result);
  })
  .catch( err => console.error('KAIROS GET RESULT ERROR:===', err.message));
});

app.get('/entry/video', (req, res) => {
  karios.get(`/v2/analytics/${videoId}`)
    .then( res => {
      console.log('kairosGetResult======result', res.data);
      res.send(res.data);
    });
});

app.get('*', (req, res) => {
  res.sendFile( path.resolve(__dirname, '..', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on', port);
});
