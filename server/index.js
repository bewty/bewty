require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const db = require('./db/index');
const app = express();
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('file-system'));
const watson = require('./watsonAPI/watsonAPI.js');
const database = require('./db/dbHelpers');
const twilio = require('./twilioAPI/twilioAPI.js');
const cors = require('cors');
const AWS = require('aws-sdk');
const querystring = require('querystring');
const multerS3 = require('multer-s3');
const s3 = new AWS.S3();
const cron = require('./callCron/cron.js');
const elastic = require('./elasticsearch/elasticsearch.js');

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

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-1'
});

app.post('/elasticSearch', (req, res) => {
  if (req.body.phonenumber[0] !== '1') {
    req.body.phonenumber = '1' + req.body.phonenumber;
  }
  let data = {
    phonenumber: req.body.phonenumber,
    search: req.body.search
  };
  elastic.eSearch(data)
  .then((results) => {
    res.status(200).send(results);
  })
  .catch((err) => {
    res.sendStatus(400);
  });
});

app.post('/scheduleCall', (req, res) => {
  let time = req.body.time.replace(':', '');
  let question = req.body.question;
  let user_id = req.body.user_id;
  let callInfo = {
    user_id: user_id,
    message: question,
    time: time
  };
  database.modifyCall(callInfo)
  .then((result) => {
    if (result === 'skip') {
      return;
    }
    return cron.scheduleCall();
  })
  .then(() => {
    if (callInfo.time === '') {
      return;
    }
    return database.callEntry(req, res, callInfo);
  })
  .catch((e) => {
    console.log('Received error:', e);
  });
});

app.post('/db/retrieveEntry', (req, res) => {
  let query = {};
  query.user_id = req.body.user_id;
  database.retrieveEntry(query)
  .then((results) => {
    res.send(results);
  })
  .catch((err) => {
    console.error(err);
  });
});

app.post('/db/userentry', (req, res) => {
  if (req.body.phonenumber[0] !== '1') {
    req.body.phonenumber = '1' + req.body.phonenumber;
  }
  let userInfo = {
    phonenumber: req.body.phonenumber
  };

  database.userEntry(req, res, userInfo);
});

app.get('/callentry/:user/:search', (req, res) => {
  let query = {};
  query.user = req.params.user;
  query.search = req.params.search;

  database.retrievePhoneEntry(req, res, query);
});

app.post('/transcribe', (req, res) => {
  let text = req.body.TranscriptionText;
  let phonenumber = req.body.Called.slice(1);
  watson.promisifiedTone(text)
  .then((tone) => {
    let log = {
      phonenumber: phonenumber,
      text: text,
      watson_results: tone
    };
    database.saveCall(req, res, log);
  });
});

app.get('/api/watson', (req, res) => {
  watson.promisifiedPersonality(req.query.text)
  .then(tone => {
    res.json(tone);
  })
  .catch(err => {
    res.sendStatus(400).send(err);
  });
});

app.post('/entry', upload.single('media'), (req, res) => {
  if (req.body.text.length === 0) {
    res.sendStatus(400);
  } else {
    watson.promisifiedTone(req.body.text)
    .then(tone => {
      let log = {
        user_id: req.body.user_id,
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
  }
});

const getAWSSignedUrl = (bucket, key) => {
  const params = {
    Bucket: bucket,
    Key: key
  };
  return s3.getSignedUrl('getObject', params);
};

app.get('/entry/:entryId/:entryType/:user_id', (req, res) => {
  let query = {};
  query.entryId = req.params.entryId;
  query.entryType = req.params.entryType;
  query.user_id = req.params.user_id;
  database.retrieveEntryMedia(query)
  .then( result => {
    let key;
    let bucket;
    query.entryType === 'video' ? key = result[0].video.key : key = result[0].audio.key;
    query.entryType === 'video' ? bucket = result[0].video.bucket : bucket = result[0].audio.bucket;
    let url = getAWSSignedUrl(bucket, key);
    res.send(JSON.stringify(url));
  })
  .catch( err => res.sendStatus(400).send(err));
});

app.get('*', (req, res) => {
  res.sendFile( path.resolve(__dirname, '..', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on', port);
});
