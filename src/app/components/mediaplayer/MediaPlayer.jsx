import React from 'react';

export default class MediaPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.renderVideoPlayer = this.renderVideoPlayer.bind(this);
    this.renderAudioPlayer = this.renderAudioPlayer.bind(this);
  }

  renderVideoPlayer() {
    const video = 'https://mindfit.s3.amazonaws.com/1492196447589?AWSAccessKeyId=AKIAJISRJUHHMSTRVLAA&Expires=1492294390&Signature=Ds%2Fll1o%2Bokr1YSFGaN0J7sCUXAg%3D';
    return (
      <video src={video} controls></video>
    );
  }

  renderAudioPlayer() {
    const audio = 'https://mindfit.s3.amazonaws.com/1492196447589?AWSAccessKeyId=AKIAJISRJUHHMSTRVLAA&Expires=1492294390&Signature=Ds%2Fll1o%2Bokr1YSFGaN0J7sCUXAg%3D';
    return (
      <audio src={audio} controls></audio>
    );
  }

  render() {
    return (
      <div>
        {this.renderVideoPlayer()}
      </div>
    );
  }
}

