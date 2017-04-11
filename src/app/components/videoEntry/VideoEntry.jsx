import React, { Component } from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import Loader from '../loader/Loader.jsx';

class VideoEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      recordVideo: null,
      blob: null,
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
  }

  componentDidMount() {
    this.getUserMedia();
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
          {this.state.uploading ? <Loader /> : null }
      </div>
    );
  }
}

export default VideoEntry;
