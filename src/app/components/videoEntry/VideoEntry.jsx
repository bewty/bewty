import React, { Component } from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import Loader from '../loader/Loader.jsx';
import $ from 'jquery';

class VideoEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      recordVideo: null,
      blob: null,
      detector: null,
      playback: false,
      recording: false,
      uploadable: false,
      uploading: false,
      uploadSuccess: null,
      uploadError: false,
      emotionable: false
    };

    this.getUserMedia = this.getUserMedia.bind(this);
    this.captureUserMedia = this.captureUserMedia.bind(this);
    this.handleVideo = this.handleVideo.bind(this);
    this.videoError = this.videoError.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.uploadVideo = this.uploadVideo.bind(this);
    this.getEmotion = this.getEmotion.bind(this);
    this.affdexStart = this.affdexStart.bind(this);
    this.affdexStop = this.affdexStop.bind(this);
    this.affdexReset = this.affdexReset.bind(this);
    this.log = this.log.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount =======');
    this.getUserMedia();

      //Draw the detected facial feature points on the image
    let drawFeaturePoints = (img, featurePoints)=> {
      console.log('drawFeaturePoints=====', img, featurePoints);
      var contxt = $('#face_video_canvas')[0].getContext('2d');

      var hRatio = contxt.canvas.width / img.width;
      var vRatio = contxt.canvas.height / img.height;
      var ratio = Math.min(hRatio, vRatio);

      contxt.strokeStyle = '#FFFFFF';
      for (var id in featurePoints) {
        contxt.beginPath();
        contxt.arc(featurePoints[id].x,
          featurePoints[id].y, 2, 0, 2 * Math.PI);
        contxt.stroke();
      }
    };


    const width = 640;
    const height = 480;
    const divRoot = $('#affdex_elements')[0];
    const faceMode = affdex.FaceDetectorMode.LARGE_FACES;

    //Construct a CameraDetector and specify the image width / height and face detector mode.
    this.state.detector = new affdex.CameraDetector(divRoot, width, height, faceMode);
    console.log('=====this.state.detector', this.state.detector);

    //Enable detection of all Expressions, Emotions and Emojis classifiers.
    this.state.detector.detectAllEmotions();
    this.state.detector.detectAllExpressions();
    this.state.detector.detectAllEmojis();
    this.state.detector.detectAllAppearance();

    //onInitialize
    this.state.detector.addEventListener('onInitializeSuccess', function() {
      //Display canvas instead of video feed because we want to draw the feature points on it
      $('#face_video_canvas').css('display', 'block');
      $('#face_video').css('display', 'none');
      console.log('onInitializeSuccess');
    });
    this.state.detector.addEventListener('onInitializeFailure', function(err) {
      console.log('onInitializeFailure', err);
    });

    //onWebCamConnect
    this.state.detector.addEventListener('onWebcamConnectSuccess', function() {
      console.log('Webcam access allowed');
    });
    this.state.detector.addEventListener('onWebcamConnectFailure', function() {
      console.log('I"ve failed to connect to the camera :(');
    });

    //onStop
    this.state.detector.addEventListener('onStopSuccess', function() {
      console.log('======onStopSuccess======');
      $('#results').html('');
    });
    this.state.detector.addEventListener('onStopFailure', function() {
      console.log('======onStopFailure======');
    });

    //onReset
    detector.addEventListener('onResetSuccess', function() {
      console.log('======onResetSuccess======');
    });
    detector.addEventListener('onResetFailure', function() {
      console.log('======onResetFailure======');
    });

    //Add a callback to receive the results from processing an image.
    //The faces object contains the list of the faces detected in an image.
    //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
    this.state.detector.addEventListener('onImageResultsSuccess', function(faces, image, timestamp) {
      console.log('=====add listener for logging emotions and results', faces, image, timestamp);
    //   $('#results').html('');
    //   console.log('#results', 'Timestamp: ' + timestamp.toFixed(2));
    //   console.log('#results', 'Number of faces found: ' + faces.length);
    //   if (faces.length > 0) {
    //     console.log('#results', 'Appearance: ' + JSON.stringify(faces[0].appearance));
    //     console.log('#results', 'Emotions: ' + JSON.stringify(faces[0].emotions, function(key, val) {
    //       return val.toFixed ? Number(val.toFixed(0)) : val;
    //     }));
    //     console.log('#results', 'Expressions: ' + JSON.stringify(faces[0].expressions, function(key, val) {
    //       return val.toFixed ? Number(val.toFixed(0)) : val;
    //     }));
    //     console.log('#results', 'Emoji: ' + faces[0].emojis.dominantEmoji);
    //     drawFeaturePoints(image, faces[0].featurePoints);
    //   }
    });
  }

  getUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
      this.captureUserMedia( stream => this.handleVideo(stream));
    } else {
      console.log('getUserMedia not supported');
    }
  }

  captureUserMedia(callback) {
    const constraints = {
      video: {
        mandatory: {
          maxWidth: 480,
          maxHeight: 360
        }
      },
      audio: true,
    };

    navigator.getUserMedia( constraints, callback, err => this.videoError(err));
  }

  handleVideo(stream) {
    this.setState({
      src: window.URL.createObjectURL(stream)
    });
  }

  videoError(err) {
    alert('Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.');
  }


  startRecord() {
    this.setState({
      playback: false,
      uploadable: false,
      emotionable: false,
      uploadError: false,
      recording: true,
    });

    this.getUserMedia();
    this.captureUserMedia( stream => {
      this.state.recordVideo = RecordRTC(stream, {type: 'video'});
      this.state.recordVideo.startRecording();
    });

    setTimeout( () => {
      this.stopRecord();
    }, 30000);
  }

  stopRecord() {
    this.state.recordVideo.stopRecording((videoURL) => {
      this.setState({
        blob: this.state.recordVideo.blob,
        src: videoURL,
        playback: true,
        uploadable: true,
        recording: false
      });
    });
  }

  uploadVideo() {
    this.setState({
      uploading: true,
      uploadError: false,
    });

    let blob = this.state.blob;
    let fd = new FormData();
    fd.append('video', blob);
    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };

    axios.post('/entry/video', fd, config)
    .then( res => {
      this.setState({
        emotionable: true,
        uploading: false,
      });
      console.log('video upload to server COMPLETE:', res);
    })
    .catch( err => {
      this.setState({
        emotionable: false,
        uploadError: true,
        uploading: false
      });
      console.log('video upload to server ERROR:', err);
    });
  }

  getEmotion() {
    axios.get('/entry/video')
    .then( res => console.log('=====getEmotion', res))
    .catch( err => console.error('====error', err));
  }

  affdexStart() {
    if (this.state.detector && !this.state.detector.isRunning) {
      this.state.detector.start();
    }
    this.log('#logs', 'Clicked the start button');
    console.log('=====start button clicked!!');
  }

  affdexStop() {
    console.log('=====stop button clicked!!');
    if (this.state.detector && this.state.detector.isRunning) {
      this.state.detector.removeEventListener();
      this.state.detector.stop();
    }
  }

  affdexReset() {
    if (this.state.detector && this.state.detector.isRunning) {
      this.state.detector.reset();
    }
  }

  log(nodeName, msg) {
    $(nodeName).append('<span>' + msg + '</span><br />');
  }

  render() {
    return (
      <div className='container'>
        <h1 className='title'>Video Entry</h1>
          { this.state.playback
            ? <video autoPlay='true' src={this.state.src} controls></video>
            : <video autoPlay='true' src={this.state.src} muted></video>
          }
          <div className='controls'>
            {this.state.recording ? null : <button onClick={this.startRecord}>Record</button>}
            {this.state.recording ? <button onClick={this.stopRecord}>Stop</button> : null}
            {this.state.uploadable ? <button onClick={this.uploadVideo}>Upload</button> : null }
            {this.state.emotionable ? <button onClick={this.getEmotion}>Get Emotion Result</button> : null }
          </div>
          <div className='flash-message'>
            {this.state.uploadError ? <p>Error Uploading Video, Please Try Again</p> : null }
          </div>
          <div id='affdex_elements'> </div>
          {this.state.uploading ? <Loader /> : null }
           <button id='start' onClick={this.affdexStart}>Affdex Start</button>
           <button id='start' onClick={this.affdexStop}>Affdex Stop</button>
           <button id='start' onClick={this.affdexStop}>Affdex Reset</button>
          <div id='logs'>Logs</div>
          <div id='results'>Results</div>
      </div>
    );
  }
}

export default VideoEntry;
