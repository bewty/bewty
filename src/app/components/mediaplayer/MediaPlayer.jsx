import React from 'react';

export default class MediaPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.renderVideoPlayer = this.renderVideoPlayer.bind(this);
    this.renderAudioPlayer = this.renderAudioPlayer.bind(this);
  }

  renderVideoPlayer(mediaSrc) {
    return (
      <div className='video-player'>
        <video src={mediaSrc} controls></video>
      </div>
    );
  }

  renderAudioPlayer(mediaSrc) {
    return (
      <div className='audio-player'>
        <audio src={mediaSrc} controls></audio>
      </div>
    );
  }

  render() {
    const {mediaSrc, mediaType} = this.props;
    return (
      <div className='media-container'>
        {mediaType === 'video' ? this.renderVideoPlayer(mediaSrc) : this.renderAudioPlayer(mediaSrc) }
      </div>
    );
  }
}


