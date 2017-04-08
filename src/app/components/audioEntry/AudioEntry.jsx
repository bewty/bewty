import React, { Component } from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';

class AudioEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      recordAudio: null,
      blob: null,
      uploading: false,
      uploadSuccess: null
    };

    this.getUserMedia = this.getUserMedia.bind(this);
    this.captureUserMedia = this.captureUserMedia.bind(this);
    this.handleAudio = this.handleAudio.bind(this);
    this.audioError = this.audioError.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.uploadAudio = this.uploadAudio.bind(this);
  }

  componentDidMount(){
    this.getUserMedia();
  }

  getUserMedia() {

    navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
      this.captureUserMedia( stream => this.handleAudio(stream));
    } else {
       console.log("getUserMedia not supported");
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
  }

  stopRecord() {
    this.state.recordAudio.stopRecording((audioURL) => {
      this.setState({
        blob: this.state.recordAudio.blob,
        src: audioURL
      });
    });
  }

  uploadAudio() {
    let blob = this.state.blob;
    let fd = new FormData();
    fd.append('audio', blob);

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };
    axios.post('/entry/audio', fd, config)
    .then( res => console.log('video upload to server done', res));
  }

  render() {
    return (
      <div className="container">
        <h1>Audio Entry</h1>
        <audio autoPlay='true' src={this.state.src} muted="muted" controls></audio>
        <button onClick={this.startRecord}>Record</button>
        <button onClick={this.stopRecord}>Stop</button>
        <button onClick={this.uploadAudio}>Upload</button>
      </div>
    );
  }
}

export default AudioEntry;
