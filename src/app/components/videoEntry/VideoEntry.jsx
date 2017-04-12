import React, { Component } from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import Loader from '../loader/Loader.jsx';
import $ from 'jquery';

var rawData = [];

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
      emotionable: false,
      okayToRecord: false,
      rawData: [],
    };

    this.getUserMedia = this.getUserMedia.bind(this);
    this.captureUserMedia = this.captureUserMedia.bind(this);
    this.handleVideo = this.handleVideo.bind(this);
    this.videoError = this.videoError.bind(this);
    this.onRecord = this.onRecord.bind(this);
    this.onStop = this.onStop.bind(this);
    this.uploadVideo = this.uploadVideo.bind(this);
    this.onReset = this.onReset.bind(this);
    // this.affdexStart = this.affdexStart.bind(this);
    // this.affdexStop = this.affdexStop.bind(this);
  }

  componentDidMount() {
    this.getUserMedia();

    const width = 480;
    const height = 360;
    const divRoot = $('#affdex_elements')[0];
    const faceMode = affdex.FaceDetectorMode.LARGE_FACES;

    //Construct a CameraDetector and specify the image width / height and face detector mode.
    this.state.detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

    //Enable detection of all Expressions, Emotions and Emojis classifiers.
    this.state.detector.detectAllEmotions();
    this.state.detector.detectAllEmojis();
    // this.state.detector.detectAllExpressions();
    // this.state.detector.detectAllAppearance();

    //Draw the detected facial feature points on the image
    const drawFeaturePoints = (img, featurePoints)=> {
      const contxt = $('#face_video_canvas')[0].getContext('2d');

      const hRatio = contxt.canvas.width / img.width;
      const vRatio = contxt.canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio);

      contxt.strokeStyle = '#FFFFFF';
      for (let id in featurePoints) {
        contxt.beginPath();
        contxt.arc(featurePoints[id].x,
          featurePoints[id].y, 2, 0, 2 * Math.PI);
        contxt.stroke();
      }
    };

    const okayToRecord = () => {
      console.log('okayToRecord');
      this.setState({
        okayToRecord: true
      });
    };

    const onRecordingEmotion = () => {
      return this.state.recording;
    };

    //onInitialize
    this.state.detector.addEventListener('onInitializeSuccess', function() {
      //Display canvas instead of video feed because we want to draw the feature points on it
      // $('#face_video_canvas').css('display', 'none');
      // $('#face_video').css('display', 'none');
      okayToRecord();
      console.log('onInitializeSuccess');
    });
    this.state.detector.addEventListener('onInitializeFailure', function(err) { console.log('onInitializeFailure', err); });
    //onWebCamConnect
    this.state.detector.addEventListener('onWebcamConnectSuccess', function() { console.log('Webcam access allowed'); });
    this.state.detector.addEventListener('onWebcamConnectFailure', function() { console.log('I"ve failed to connect to the camera :('); });
    //onStop
    this.state.detector.addEventListener('onStopSuccess', function() { console.log('onStopSuccess'); });
    this.state.detector.addEventListener('onStopFailure', function() { console.log('onStopFailure'); });
    //onReset
    this.state.detector.addEventListener('onResetSuccess', function() { console.log('onResetSuccess'); });
    this.state.detector.addEventListener('onResetFailure', function() { console.log('onResetFailure'); });

    //Results
    this.state.detector.addEventListener('onImageResultsSuccess', function(faces, image, timestamp) {
      // console.log('onImageResultsSuccess====', faces, image, timestamp);

      if (faces.length > 0) {
        let instance = [{
          timestamp: timestamp,
          anger: faces[0].emotions.anger,
          contempt: faces[0].emotions.contempt,
          fear: faces[0].emotions.fear,
          joy: faces[0].emotions.joy,
          sadness: faces[0].emotions.sadness,
          surprise: faces[0].emotions.surprise,
          emoji: faces[0].emojis.dominantEmoji,
          // engagement: faces[0].emotions.engagement,
          // valence: faces[0].emotions.valence,
        }];

        if ( onRecordingEmotion() ) {
          rawData.push(instance);
        }
        drawFeaturePoints(image, faces[0].featurePoints);
        console.log('rawData======', rawData);
      }
    });
    this.state.detector.addEventListener('onImageResultsFailure', function (image, timestamp, errDetail) { console.log('onImageResultsFailure :', errDetail); });

    //start emotion recording
    if (this.state.detector && !this.state.detector.isRunning) {
      this.state.detector.start();
    }
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

  onRecord() {
    console.log('=====start record clicked!!');
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
      this.onStop();
      this.state.detector.removeEventListener();
      this.state.detector.stop();
    }, 30000);

    if (this.state.detector && !this.state.detector.isRunning) {
      this.state.detector.start();
    }
  }

  onStop() {
    console.log('=====stop button clicked!!');
    if (this.state.detector && this.state.detector.isRunning) {
      this.state.detector.removeEventListener();
      this.state.detector.stop();
    }

    this.state.recordVideo.stopRecording((videoURL) => {
      console.log('videoURL======', videoURL);
      console.log('bufferSize======', this.state.recordVideo.bufferSize);
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

  onReset() {
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
            {this.state.okayToRecord ? <button onClick={this.onRecord}>Record</button> : null}
            {this.state.recording ? <button onClick={this.onStop}>Stop</button> : null}
            {this.state.uploadable ? <button onClick={this.uploadVideo}>Upload</button> : null }
          </div>
          <div className='flash-message'>
            {this.state.uploadError ? <p>Error Uploading Video, Please Try Again</p> : null }
            {this.state.okayToRecord ? null : <p>Loading and starting the emotions detector, this may take few minutes ...</p> }
          </div>
          <div id='affdex_elements'> </div>
          {this.state.uploading ? <Loader /> : null }
          <button onClick={this.onReset}>Reset</button>
      </div>
    );
  }
}

export default VideoEntry;
