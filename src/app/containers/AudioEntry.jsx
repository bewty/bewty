import React, { Component } from 'react';
import VoiceRecognition from '../components/VoiceRecognition/VoiceRecognition.jsx';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import { connect } from 'react-redux';
import { setSourceUrl, stopRecordAndSet } from '../actions/index.js';
import { bindActionCreators } from 'redux';

class AudioEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.recordAudio = null;
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
      this.recordAudio = RecordRTC(stream, {type: 'audio'});
      this.recordAudio.startRecording();
    });

    setTimeout( () => {
      this.stopRecord();
    }, 30000);
    this.setState({
      start: true
    });
  }

  stopRecord() {
    this.recordAudio.stopRecording((audioURL) => {
      this.props.stopRecordAndSet(this.recordAudio.blob, true, audioURL);
    });
  }

  uploadAudio() {
    let blob = this.props.audio.blob;
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
        <audio autoPlay='true' src={this.props.audio.src} muted="muted" controls></audio>
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
    audio: state.audio
  };
};

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setSourceUrl: setSourceUrl,
    stopRecordAndSet: stopRecordAndSet
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioEntry);
