require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/index');
const app = express();
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('file-system'));
const watson = require('./watsonAPI/watsonAPI.js');
const database = require('./db/dbHelpers');
const cors = require('cors');
const xml = require('xml');

const twilio = require('./twilioAPI/twilioAPI.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '..', 'dist')));
app.use(require('morgan')('combined'));
app.use(cors());

app.post('/recording', (req, res) => {
  let number = req.body.number || process.env.TWILIO_TO;
  let name = req.body.name || 'Eugene';
  console.log('Received post to /recording:', name, ':', number);
  twilio.dialNumbers(number, name);
  res.status(200).send('Successfuly called');
});

app.post('/transcribe', (req, res) => {
  let text = req.body.TranscriptionText;
  let callSid = req.body.CallSid;
  console.log('Received transcription information to /transcribe:', req.body);
  watson.promisifiedPersonality(text)
  .then((results) => {
    console.log('Watson received phone transcription:');
    fs.writeFile(`./watsonAPI/watsonResults/${req.body.TranscriptionSid}`, JSON.stringify(results));
  });
  res.status(200).send('Received to /transcribe');
});

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

app.get('/test', (req, res) => {
  console.log(req.body.test);
  res.send('hello world');
});

app.get('*', (req, res) => {
  res.sendFile( path.resolve(__dirname, '..', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on', port);
});