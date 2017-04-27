import React, { Component } from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import Loader from '../loader/Loader.jsx';
import VoiceRecognition from '../VoiceRecognition/VoiceRecognition.jsx';
import LoaderMobileDetected from '../loader-mobile-detected/LoaderMobileDetected';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import RecordButton from 'material-ui/svg-icons/av/fiber-manual-record';
import StopButton from 'material-ui/svg-icons/av/stop';
import UploadButton from 'material-ui/svg-icons/file/cloud-upload';
import { Link } from 'react-router-dom';

const styles = {
  button: {
    marginRight: 12,
  }
};

export default class VideoEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      recordVideo: null,
      stream: null,
      blob: null,
      detector: null,
      playback: false,
      recording: false,
      uploadable: false,
      uploading: false,
      uploadSuccess: false,
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
      transcript: '',
      noTranscript: false,
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
    this.onSubmit = this.onSubmit.bind(this);
    this.renderControls = this.renderControls.bind(this);
    this.renderFlashMessage = this.renderFlashMessage.bind(this);
    this.renderUploadBtn = this.renderUploadBtn.bind(this);
  }

  componentDidMount() {
    this.props._detectMobileUser();
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
      if (!this.state.uploadable && !this.state.recording) {
        this.setState({
          okayToRecord: true,
          loadingRecordMsg: false
        });
      }
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
    this.setState({ src: window.URL.createObjectURL(stream), stream: stream });
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
      start: true,
      transcript: '',
      uploadError: false,
      uploadSuccess: false,
      noTranscript: false
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
      },
      uploadable: false,
      noTranscript: false,
      uploadError: false,
      uploadSuccess: false,
      transcript: ''
    });
  }

  getAverage() {
    const length = this.state.rawData.length;
    for (let key in this.state.avgData) {
      key === 'emoji' ? null : this.state.avgData[key] = this.state.avgData[key] / length;
    }
    return this.state.avgData;
  }

  uploadVideo(avgData) {
    this.setState({
      uploading: true,
      uploadError: false,
      uploadSuccess: false
    });

    let blob = this.state.blob;
    let fd = new FormData();
    fd.append('media', blob);
    fd.append('entryType', 'video');
    fd.append('rawData', JSON.stringify(this.state.rawData));
    fd.append('avgData', JSON.stringify(avgData));
    fd.append('text', this.state.transcript);
    fd.append('user_id', localStorage.user_id);

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };

    axios.post('/entry', fd, config)
    .then( res => {
      this.setState({
        uploading: false,
        uploadSuccess: true,
        uploadError: false,
        transcript: '',
        okayToRecord: true,
        uploadable: false,
        recording: false
      });
      console.log('video upload to server COMPLETE:', res);
    })
    .catch( err => {
      this.setState({
        uploading: false,
        uploadSuccess: false,
        uploadError: true,
        okayToRecord: true,
        uploadable: false,
        recording: false
      });
      console.log('video upload to server ERROR:', err);
    });
  }

  onSubmit() {
    return new Promise( (resolve, reject) => {
      resolve(this.getAverage());
    })
    .then( avgData => this.uploadVideo(avgData))
    .catch( err => console.error('Error on submit', err));
  }

  onEnd() {
    console.log('end');
    if (this.state.transcript.length > 0) {
      this.setState({
        start: false,
        stop: false,
      });
    } else {
      this.setState({
        start: false,
        stop: false,
        noTranscript: true,
        okayToRecord: true,
        uploadable: false,
        recording: false
      });
    }
  }

  onResult ({ finalTranscript }) {
    console.log(finalTranscript);
    this.setState({
    start: false,
    transcript: finalTranscript
    });
  }

  renderControls() {
    return (
      <div className='controls'>
        {this.state.okayToRecord ?
          <MuiThemeProvider>
            <RaisedButton
              icon={<RecordButton
                      color="red"
                      style={{paddingLeft: '0'}}
                    />}
              onTouchTap={this.onRecord}
              style={styles.button}
            />
          </MuiThemeProvider>
          : null}
        {this.state.recording ?
          <MuiThemeProvider>
            <RaisedButton
              icon={<StopButton
                      color="#565a5c"
                      style={{paddingLeft: '0'}}
                    />}
              onTouchTap={this.onStop}
              style={styles.button}
            />
          </MuiThemeProvider>
          : null}
        <MuiThemeProvider>
          <RaisedButton
            label="Reset"
            onTouchTap={this.onReset}
          />
        </MuiThemeProvider>
      </div>
    );
  }

  renderFlashMessage() {
    return (
      <div className='flash-message'>
        {this.state.loadingRecordMsg && !this.props.mobile ? <p>Loading and starting the emotions detector.<br/>This may take a moment.</p> : null }
        {this.state.loadingRecordMsg && !this.props.mobile ? <Loader /> : null }
        {this.state.uploadError ? <p className="error">There seems to have been an error.<br/>Please try again later!</p> : null }
        {this.state.noTranscript ? <p className="error">There seems to be an issue recognizing your voice.<br/>Please refresh and try again later!</p> : null }
        {this.state.uploadSuccess ? <p><Link className="success" to="/entries">Success! You can view your submissions here!</Link></p> : null}
      </div>
    );
  }

  renderUploadBtn() {
    return (
      <div className='upload-container'>
          <MuiThemeProvider>
            <RaisedButton
              icon={<UploadButton
                      color="#fff"
                      style={{paddingLeft: '0'}}
                    />}
              fullWidth={true}
              buttonStyle={{backgroundColor: '#EB5424', height: 50, width: 400}}
              onTouchTap={() => {
                this.state.transcript.length > 0 && this.onSubmit();
              }}
            />
          </MuiThemeProvider>
      </div>
    );
  }

  renderVoiceRecognition() {
    return (
      <VoiceRecognition
        onEnd={this.onEnd}
        onResult={this.onResult}
        continuous={true}
        lang="en-US"
        stop={this.state.stop}
      />
    );
  }

  render() {
    return (
      <div>
        {!this.props.mobile ?
          <div>
            <div className='video-entry-container'>
              <div id='affdex_elements' ref='affdex_elements'> </div>
              {this.state.start && this.renderVoiceRecognition}
              { this.state.playback
                ? <video autoPlay='true' src={this.state.src} controls></video>
                : <video autoPlay='true' src={this.state.src} muted></video>
              }
              {this.renderFlashMessage()}
              {this.renderControls()}
              {this.state.uploading ? <Loader /> : null }
          </div>
          {this.renderUploadBtn()}
        </div>
      : <LoaderMobileDetected />}
    </div>
      );
  }

  componentWillUnmount() {
    this.state.stream.stop();
    this.state.detector.stop();
    this.state.detector.removeEventListener();
  }
}


