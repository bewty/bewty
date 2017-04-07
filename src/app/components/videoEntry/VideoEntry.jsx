import React, { Component } from 'react';
import RecordRTC from 'recordrtc';
import $ from 'jquery';

class VideoEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      recordVideo: null,
      blob: null,
      uploading: false,
      uploadSuccess: null
    }

    this.getUserMedia = this.getUserMedia.bind(this);
    this.captureUserMedia = this.captureUserMedia.bind(this);
    this.handleVideo = this.handleVideo.bind(this);
    this.videoError = this.videoError.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.uploadVideo = this.uploadVideo.bind(this);
  }

  componentDidMount(){
    this.getUserMedia();
  }

  getUserMedia() {

    navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
      this.captureUserMedia( stream => this.handleVideo(stream));
    } else {
       console.log("getUserMedia not supported");
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

    navigator.getUserMedia( constraints , callback , err => this.videoError(err));
  }

  handleVideo(stream) {
    this.setState({
      src: window.URL.createObjectURL(stream)
    });
  }

  videoError(err) {
    alert('Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.');
  }

  uploadVideo(blob) {
    let fd = new FormData();
    fd.append('fname', blob);
    $.ajax({
      type:'POST',
      url:'/entry/video',
      data: fd,
      processData: false,
      contentType: false
    }).done( data => console.log(data));
  }

  startRecord() {
    this.captureUserMedia( stream => {
      this.state.recordVideo = RecordRTC(stream, {type:'video'});
      this.state.recordVideo.startRecording();
    })

    setTimeout( () => {
      this.stopRecord();
    }, 30000)
  }

  stopRecord() {
    this.state.recordVideo.stopRecording((videoURL) => {
      this.setState({
         blob : this.state.recordVideo.blob,
         src: videoURL
       });
    });
  }

  render() {
    return (
      <div className="container">
        <h1>Video Entry</h1>
        <video autoPlay='true' src={this.state.src} controls></video>
        <button onClick={this.startRecord}>Record</button>
        <button onClick={this.stopRecord}>Stop</button>
      </div>
    )
  }
}

export default VideoEntry;
