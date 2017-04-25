import React, { Component } from 'react';
import VoiceRecognition from '../VoiceRecognition/VoiceRecognition.jsx';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import LoaderMobileDetected from '../loader-mobile-detected/LoaderMobileDetected';
import Loader from '../loader/Loader.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import RecordButton from 'material-ui/svg-icons/av/fiber-manual-record';
import StopButton from 'material-ui/svg-icons/av/stop';
import UploadButton from 'material-ui/svg-icons/file/cloud-upload';
import { Link } from 'react-router-dom';

class AudioEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      recordAudio: null,
      blob: null,
      start: false,
      stop: false,
      transcript: '',
      uploading: false,
      uploadError: false,
      uploadSuccess: false,
      noTranscript: false,
      stream: null
    };
    this.getUserMedia = this.getUserMedia.bind(this);
    this.captureUserMedia = this.captureUserMedia.bind(this);
    this.handleAudio = this.handleAudio.bind(this);
    this.audioError = this.audioError.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.uploadAudio = this.uploadAudio.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResult = this.onResult.bind(this);
  }

  componentDidMount() {
    this.props._detectMobileUser();
    this.getUserMedia();
  }

  getUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
      this.captureUserMedia( stream => this.handleAudio(stream));
    } else {
      console.log('getUserMedia not supported');
    }
  }

  captureUserMedia(callback) {
    const constraints = {
      video: false,
      audio: true,
    };

    navigator.getUserMedia( constraints, callback, err => this.audioError(err));
  }

  handleAudio(stream) {
    this.setState({
      src: window.URL.createObjectURL(stream),
      stream: stream
    });
  }

  audioError(err) {
    alert('Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.');
  }


  startRecord() {
    this.getUserMedia();
    this.captureUserMedia( stream => {
      this.state.recordAudio = RecordRTC(stream, {type: 'audio'});
      this.state.recordAudio.startRecording();
    });

    setTimeout( () => {
      this.stopRecord();
    }, 30000);
    this.setState({
      start: true,
      transcript: '',
      uploadError: false,
      uploadSuccess: false,
      noTranscript: false
    });
  }

  stopRecord() {
    console.log('stop');
    this.state.recordAudio.stopRecording((audioURL) => {
      this.setState({
        blob: this.state.recordAudio.blob,
        src: audioURL,
        stop: true
      });
    });
  }

  uploadAudio() {
    this.setState({
      uploading: true,
      uploadError: false,
      uploadSuccess: false
    });
    let self = this;
    let blob = this.state.blob;
    let fd = new FormData();
    fd.append('media', blob);
    fd.append('entryType', 'audio');
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
        transcript: '' });
      console.log('audio upload to server done', res);
    })
    .catch(err => {
      this.setState({
        uploading: false,
        uploadSuccess: false,
        uploadError: true
      });
      console.log('audio upload error...', err);
    });
  }

  onEnd() {
    console.log('end');
    if (this.state.transcript.length > 0) {
      this.setState({
        start: false,
        stop: false
      });
    } else {
      this.setState({
        start: false,
        stop: false,
        noTranscript: true
      });
    }
  }

  onResult ({ finalTranscript }) {
    this.setState({
      start: false,
      transcript: finalTranscript
    });
  }

  render() {
    return (
      <div>
        {!this.props.mobile ?
        <div className="container">
          <br/>
          <audio autoPlay='true' src={this.state.src} muted="muted" controls></audio>
          <div>
          <MuiThemeProvider>
            <RaisedButton
              icon={
                 (!this.state.start && !this.state.stop) ?
                  <RecordButton
                    color="red"
                    onTouchTap={this.startRecord}
                    style={{paddingLeft: '0'}}
                  />
                  :
                  <StopButton
                    color="#565a5c"
                    onTouchTap={this.stopRecord}
                    style={{paddingLeft: '0'}}
                  />
                }
              onTouchTap={(!this.state.start && !this.state.stop) ?
                          this.startRecord : this.stopRecord}
              style={{marginRight: '12px'}}
            />
            </MuiThemeProvider>
            <MuiThemeProvider>
            <RaisedButton
              icon={<UploadButton
                      color="#565a5c"
                      style={{paddingLeft: '0'}}
                    />}
              onTouchTap={() => {
                console.log(this.state.transcript.length);
                this.state.transcript.length > 0 && this.uploadAudio();
              }}
            />
          </MuiThemeProvider>
          </div>
          <p>{this.state.transcript}</p>
          {this.state.start && (
            <VoiceRecognition
              onEnd={this.onEnd}
              onResult={this.onResult}
              continuous={true}
              lang="en-US"
              stop={this.state.stop}
            />
          )}
          {this.state.uploading ? <Loader /> : null }
          <div>
            {this.state.uploadError ? <p className="error">There seems to have been an error.<br/>Please try again later!</p> : null }
            {this.state.noTranscript ? <p className="error">There seems to be an issue recognizing your voice.<br/>Please refresh and try again later!</p> : null }
            {this.state.uploadSuccess ? <p><Link className="success" to="/entries">Success! You can view your submissions here!</Link></p> : null}
          </div>
        </div>
        : <LoaderMobileDetected /> }
      </div>
    );
  }

  componentWillUnmount() {
    this.state.stream.stop();
  }
}

export default AudioEntry;
