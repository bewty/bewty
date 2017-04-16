import React, { Component } from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import Loader from '../loader/Loader.jsx';
import VoiceRecognition from '../VoiceRecognition/VoiceRecognition.jsx';

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
      loadingRecordMsg: true,
      rawData: [],
      avgData: {
        anger: 0,
        contempt: 0,
        fear: 0,
        joy: 0,
        sadness: 0,
        surprise: 0,
      },
      start: false,
      stop: false,
      transcript: ''
    };

    this.getUserMedia = this.getUserMedia.bind(this);
    this.captureUserMedia = this.captureUserMedia.bind(this);
    this.handleVideo = this.handleVideo.bind(this);
    this.videoError = this.videoError.bind(this);
    this.onRecord = this.onRecord.bind(this);
    this.onStop = this.onStop.bind(this);
    this.uploadVideo = this.uploadVideo.bind(this);
    this.onReset = this.onReset.bind(this);
    this.getAverage = this.getAverage.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResult = this.onResult.bind(this);
  }

  componentDidMount() {
    this.getUserMedia();
    const width = 480;
    const height = 360;
    const divRoot = this.refs.affdex_elements;
    const faceMode = affdex.FaceDetectorMode.LARGE_FACES;

    this.state.detector = new affdex.CameraDetector(divRoot, width, height, faceMode);
    this.state.detector.detectAllEmotions();
    this.state.detector.detectAllEmojis();

    //onInitialize
    this.state.detector.addEventListener('onInitializeSuccess', () => {
      this.setState({
        okayToRecord: true,
        loadingRecordMsg: false
      });
      console.log('onInitializeSuccess');
    });
    this.state.detector.addEventListener('onInitializeFailure', (err) => console.log('onInitializeFailure', err));

    //onWebCamConnect
    this.state.detector.addEventListener('onWebcamConnectSuccess', () => console.log('Webcam access allowed'));
    this.state.detector.addEventListener('onWebcamConnectFailure', () => console.log('I"ve failed to connect to the camera :('));

    //onStop
    this.state.detector.addEventListener('onStopSuccess', () => console.log('onStopSuccess'));
    this.state.detector.addEventListener('onStopFailure', () => console.log('onStopFailure'));

    //onReset
    this.state.detector.addEventListener('onResetSuccess', () => console.log('onResetSuccess'));
    this.state.detector.addEventListener('onResetFailure', () => console.log('onResetFailure'));

    //Results
    this.state.detector.addEventListener('onImageResultsSuccess', (faces, image, timestamp) => {
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
        }];

        this.state.avgData.anger += faces[0].emotions.anger;
        this.state.avgData.contempt += faces[0].emotions.contempt;
        this.state.avgData.fear += faces[0].emotions.fear;
        this.state.avgData.joy += faces[0].emotions.joy;
        this.state.avgData.sadness += faces[0].emotions.sadness;
        this.state.avgData.surprise += faces[0].emotions.surprise;
        this.state.avgData.emoji += faces[0].emojis.dominantEmoji;

        if ( this.state.recording ) {
          this.state.rawData.push(instance);
        }
      }
    });
    this.state.detector.addEventListener('onImageResultsFailure', (image, timestamp, errDetail) => console.log('onImageResultsFailure :', errDetail));

    //start emotion recording
    if (this.state.detector && !this.state.detector.isRunning) {
      this.state.detector.start();
    }
  }

  getUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia ? this.captureUserMedia( stream => this.handleVideo(stream)) : console.log('getUserMedia not supported');
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
    this.setState({ src: window.URL.createObjectURL(stream) });
  }

  videoError(err) {
    alert('Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.');
  }

  onRecord() {
    this.getUserMedia();
    this.setState({
      okayToRecord: false,
      loadingRecordMsg: false,
      playback: false,
      uploadable: false,
      emotionable: false,
      uploadError: false,
      recording: true,
      rawData: [],
      avgData: {
        anger: 0,
        contempt: 0,
        fear: 0,
        joy: 0,
        sadness: 0,
        surprise: 0,
      },
      start: true
    });

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
    if (this.state.detector && this.state.detector.isRunning) {
      this.state.detector.removeEventListener();
      this.state.detector.stop();
    }

    this.state.recordVideo.stopRecording((videoURL) => {
      this.setState({
        blob: this.state.recordVideo.blob,
        src: videoURL,
        playback: true,
        uploadable: true,
        recording: false,
        stop: true
      });
    });
  }

  onReset() {
    if (this.state.detector && this.state.detector.isRunning) {
      this.state.detector.reset();
    }
    if (this.state.detector && !this.state.detector.isRunning) {
      this.state.detector.start();
    }
    this.setState({
      okayToRecord: false,
      loadingRecordMsg: true,
      rawData: [],
      avgData: {
        anger: 0,
        contempt: 0,
        fear: 0,
        joy: 0,
        sadness: 0,
        surprise: 0,
      }
    });
  }

  getAverage() {
    const length = this.state.rawData.length;
    for (let key in this.state.avgData) {
      key === 'emoji' ? null : this.state.avgData[key] = this.state.avgData[key] / length;
    }
  }

  uploadVideo() {
    this.setState({
      uploading: true,
      uploadError: false,
    });

    this.getAverage();

    let blob = this.state.blob;
    let fd = new FormData();
    fd.append('media', blob);
    fd.append('entryType', 'video');
    fd.append('rawData', JSON.stringify(this.state.rawData));
    fd.append('avgData', JSON.stringify(this.state.avgData));
    fd.append('text', this.state.transcript);
    fd.append('user_id', localStorage.user_id);

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };

    axios.post('/entry', fd, config)
    .then( res => {
      this.setState({ uploading: false });
      console.log('video upload to server COMPLETE:', res);
    })
    .catch( err => {
      this.setState({
        uploadError: true,
        uploading: false
      });
      console.log('video upload to server ERROR:', err);
    });
  }

  onEnd() {
    this.setState({ start: false, stop: false });
  }

  onResult ({ finalTranscript }) {
    this.setState({ start: false,
                    transcript: finalTranscript });
  }
  render() {
    return (
      <div className='container'>
        {this.state.start &&
        (<VoiceRecognition
          onEnd={this.onEnd}
          onResult={this.onResult}
          continuous={true}
          lang="en-US"
          stop={this.state.stop}
        />)}
        <h1 className='title'>Video Entry</h1>
          { this.state.playback
            ? <video autoPlay='true' src={this.state.src} controls></video>
            : <video autoPlay='true' src={this.state.src} muted></video>
          }
          <div className='flash-message'>
            {this.state.uploadError ? <p>Error Uploading Video, Please Try Again</p> : null }
            {this.state.loadingRecordMsg ? <p>Loading and starting the emotions detector, this may take few minutes ...</p> : null }
          </div>
          <div className='controls'>
            {this.state.okayToRecord ? <button onClick={this.onRecord}>Record</button> : null}
            {this.state.recording ? <button onClick={this.onStop}>Stop</button> : null}
            {this.state.uploadable ? <button onClick={this.uploadVideo}>Upload</button> : null }
            <button onClick={this.onReset}>Reset</button>
          </div>
          <div id='affdex_elements' ref='affdex_elements'> </div>
          {this.state.uploading ? <Loader /> : null }
      </div>
    );
  }
}

export default VideoEntry;
