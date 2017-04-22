import React, { Component } from 'react';
import VoiceRecognition from '../VoiceRecognition/VoiceRecognition.jsx';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import RecordButton from 'material-ui/svg-icons/av/fiber-manual-record';
import StopButton from 'material-ui/svg-icons/av/stop';
import UploadButton from 'material-ui/svg-icons/file/cloud-upload';

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
      src: window.URL.createObjectURL(stream)
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
      start: true
    });
  }

  stopRecord() {
    this.state.recordAudio.stopRecording((audioURL) => {
      this.setState({
        blob: this.state.recordAudio.blob,
        src: audioURL,
        stop: true
      });
    });
  }

  uploadAudio() {
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
    .then( res => console.log('audio upload to server done', res))
    .catch(err => console.log('audio upload error...', err));
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
            onTouchTap={this.uploadAudio}
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
      </div>
    );
  }
}

export default AudioEntry;
