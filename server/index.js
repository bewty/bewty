const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const db = require('./db/index');
const cors = require('cors');
const app = express();
const AWS = require('aws-sdk');
const axios = require('axios');
const querystring = require('querystring');
const multerS3 = require('multer-s3');
const KEYS = require('../aws-config.js');
const s3 = new AWS.S3();

let videoId;

const upload = multer({
  dest: path.resolve(__dirname, '..', 'dist', 'upload'),
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
    'app_id': KEYS.KAIROS.APP_ID,
    'app_key': KEYS.KAIROS.APP_KEY
  }
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
