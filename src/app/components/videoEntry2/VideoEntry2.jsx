import React, { Component } from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import Loader from '../loader/Loader.jsx';
import $ from 'jquery';
import affdex from './affdex.js';

class VideoEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgDectorStatus: true,
      detector: null
    };
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  componentDidMount() {
    affdex.initiate();
    // const divRoot = $('#affdex_elements')[0];
    // const width = 640;
    // const height = 480;
    // const faceMode = affdex.FaceDetectorMode.LARGE_FACES;
    // //Construct a CameraDetector and specify the image width / height and face detector mode.
    // this.state.detector = new affdex.CameraDetector(divRoot, width, height, faceMode);
    // this.state.detector.detectAllEmotions();
    // this.state.detector.detectAllExpressions();
    // this.state.detector.detectAllEmojis();
    // this.state.detector.detectAllAppearance();

    // this.state.detector.detectAppearance.gender = true;
    // this.state.detector.detectEmotions.joy = true;
    // this.state.detector.detectExpressions.smile = true;

    // //Webcam Connection
    // this.state.detector.addEventListener('onWebcamConnectSuccess', function() {
    //   console.log('I was able to connect to the camera successfully.');
    // });
    // this.state.detector.addEventListener('onWebcamConnectFailure', function() {
    //   console.log('I"ve failed to connect to the camera :(');
    // });

    // //onImageResults
    // this.state.detector.addEventListener('onImageResultsSuccess', function (faces, image, timestamp) {
    //   console.log('onImageResultsSuccess :', 'faces:', faces, 'image', image, 'timestamp', timestamp);
    // });
    // this.state.detector.addEventListener('onImageResultsFailure', function (image, timestamp, errDetail) {
    //   console.log('onImageResultsFailure :', errDetail);
    // });

    // //onStop
    // this.state.detector.addEventListener('onStopSuccess', function() {
    //   console.log('onStopSuccess');
    // });
    // this.state.detector.addEventListener('onStopFailure', function() {
    //   console.log('onStopFailure');
    // });

    // //onReset
    // this.state.detector.addEventListener('onResetSuccess', function() {
    //   console.log('onResetSuccess');
    // });
    // this.state.detector.addEventListener('onResetFailure', function() {
    //   console.log('onResetFailure');
    // });

    // //Detector Initialize
    // this.state.detector.addEventListener('onInitializeSuccess', function() {
    //   console.log('The detector reports initialized');
    //   //Display canvas instead of video feed because we want to draw the feature points on it
    //   $('#face_video_canvas').css('display', 'block');
    //   $('#face_video').css('display', 'none');
    // });
    // this.state.detector.addEventListener('onInitializeFailure', function() {
    //   console.log('The detector initialize fail');
    // });


    // console.log('======divRoot', divRoot);
    // console.log('======detector', this.state.detector);
  }

  onStart() {
    if (this.state.detector && !this.state.detector.isRunning) {
      this.state.detector.start();
    }
    console.log('Clicked the start button');
  }

  onStop() {
    if (this.state.detector && this.state.detector.isRunning) {
      this.state.detector.stop();
    }
    console.log('Clicked the stop button');
  }

  onReset() {
    if (this.state.detector && this.state.detector.isRunning) {
      this.state.detector.reset();
    }
    console.log('Clicked the reset button');
  }

  // uploadVideo() {
  //   this.setState({
  //     uploading: true,
  //     uploadError: false,
  //   });

  //   let blob = this.state.blob;
  //   let fd = new FormData();
  //   fd.append('video', blob);
  //   const config = {
  //     headers: { 'content-type': 'multipart/form-data' }
  //   };

  //   axios.post('/entry/video', fd, config)
  //   .then( res => {
  //     this.setState({
  //       emotionable: true,
  //       uploading: false,
  //     });
  //     console.log('video upload to server COMPLETE:', res);
  //   })
  //   .catch( err => {
  //     this.setState({
  //       emotionable: false,
  //       uploadError: true,
  //       uploading: false
  //     });
  //     console.log('video upload to server ERROR:', err);
  //   });
  // }

  render() {
    return (
      <div className='container'>
        <h1 className='title'>Video Entry</h1>
        <div id='affdex_elements'></div>
        <div id='results'>Results</div>
        <button onClick={affdex.onStart}>Start</button>
        <button onClick={affdex.onStop}>Stop</button>
        <button onClick={affdex.onReset}>Reset</button>
        {this.state.uploading ? <Loader /> : null }
      </div>
    );
  }
}

export default VideoEntry;
