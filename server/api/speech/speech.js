const fs = require('fs');
const record = require('node-record-lpcm16');
const Speech = require('@google-cloud/speech');
const projectId = 'bewt-163703';
const speech = Speech({
  projectId: projectId,
  keyFileName: __dirname + '/../config/bewty.json',
  credentials: require('../config/bewty.json')
});

var streamingRecognize = function(filename, encoding, sampleRate) {
  // [START speech_streaming_recognize]

  // Imports the Google Cloud client library
  // const Speech = require('@google-cloud/speech');

  // Instantiates a client

  // The path to the local file on which to perform speech recognition, e.g. /path/to/audio.raw
  // const filename = '/path/to/audio.raw';

  // The encoding of the audio file, e.g. 'LINEAR16'
  // const encoding = 'LINEAR16';

  // The sample rate of the audio file, e.g. 16000
  // const sampleRate = 16000;

  const request = {
    config: {
      encoding: encoding,
      sampleRate: sampleRate
    }
  };

  // Stream the audio to the Google Cloud Speech API
  const recognizeStream = speech.createRecognizeStream(request)
    .on('error', console.error)
    .on('data', (data) => {
      console.log('Data received: %j', data);
    });

  // Stream an audio file from disk to the Speech API, e.g. "./resources/audio.raw"
  fs.createReadStream(filename).pipe(recognizeStream);
  // [END speech_streaming_recognize]
};

var streamingMicRecognize = function(encoding, sampleRate) {
  // [START speech_streaming_mic_recognize]

  // Imports the Google Cloud client library
  // const Speech = require('@google-cloud/speech');

  // Instantiates a client
  // const projectId = 'bewt-163703';
  // const speech = Speech({
  //   projectId: projectId,
  //   keyFileName: __dirname + '/bewt.json',
  //   credentials: require('./bewt.json')
  // });

  // The encoding of the audio file, e.g. 'LINEAR16'
  // const encoding = 'LINEAR16';

  // The sample rate of the audio file, e.g. 16000
  // const sampleRate = 16000;

  const request = {
    config: {
      encoding: encoding,
      sampleRate: sampleRate
    }
  };
  const fs = require('fs');
  var file = fs.createWriteStream('test.txt');
  // Create a recognize stream
  const recognizeStream = speech.createRecognizeStream(request)
    .on('error', console.error)
    .on('data', (data) => {
      process.stdout.write(data.results);
      // data.results.pipe(file);
    });

  // Start recording and send the microphone input to the Speech API
  record.start({
    sampleRate: sampleRate,
    threshold: 0
  }).pipe(recognizeStream).pipe(file);

  console.log('Listening, press Ctrl+C to stop.');
  // [END speech_streaming_mic_recognize]
};
