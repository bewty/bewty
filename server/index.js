require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/index');
const app = express();
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('file-system'));
const watson = require('./watsonAPI/watsonAPI.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '..', 'dist')));
app.use(require('morgan')('combined'));

app.post('/api/watson', (req, res) => {
  let target = 'Barack.txt';

  fs.readFileAsync(`${__dirname}/watsonAPI/watsonTest/${target}`, 'utf8')
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

app.get('*', (req, res) => {
  res.sendFile( path.resolve(__dirname, '..', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on', port);
});