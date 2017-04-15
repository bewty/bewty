import React, { Component } from 'react';
import VoiceRecognition from '../components/VoiceRecognition/VoiceRecognition.jsx';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import { connect } from 'react-redux';
import { setSourceUrl } from '../actions/index.js';
import { bindActionCreators } from 'redux';

class AudioEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordAudio: null,
      blob: null,
      uploading: false,
      uploadSuccess: null,
      start: false,
      stop: false,
      transcript: '',
      result: ''
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
    this.props.setSourceUrl(window.URL.createObjectURL(stream));
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
      this.props.setSourceUrl(audioURL);
      this.setState({
        blob: this.state.recordAudio.blob,
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
        <h1>Audio Entry</h1>
        <audio autoPlay='true' src={this.props.src} muted="muted" controls></audio>
        <button onClick={this.startRecord}>Record</button>
        <button onClick={this.stopRecord}>Stop</button>
        <button onClick={this.uploadAudio}>Upload</button>
        <p>{this.state.transcript}</p>
        <p>{this.state.result}</p>
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

var mapStateToProps = (state) => {
  return {
    src: state.src
  };
};

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators({setSourceUrl: setSourceUrl}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioEntry);
