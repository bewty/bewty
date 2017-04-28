import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextEntry from '../textEntry/TextEntry';
import VideoEntry from '../videoEntry/VideoEntry';
import AudioEntry from '../audioEntry/AudioEntry';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Card} from 'material-ui/Card';
import Text from 'material-ui/svg-icons/editor/text-fields';
import Video from 'material-ui/svg-icons/AV/videocam';
import Audio from 'material-ui/svg-icons/AV/mic';

const styles = {
  active: {
    backgroundColor: 'red',
    margin: 12,
  },
  button: {
    backgroundColor: '#a4c639',
    margin: 12,
  }
};

export default class NewEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'Text',
      mobile: false,
      uploadError: false,
      noTranscript: false,
      uploadSuccess: false,
      loadingRecordMsg: true,
    };
    this._entryTypeOnClick = this._entryTypeOnClick.bind(this);
    this.renderNav = this.renderNav.bind(this);
    this._detectMobileUser = this._detectMobileUser.bind(this);
  }

  _entryTypeOnClick(name) {
    this.setState({
      activeTab: name
    });
  }

  renderNav() {
    return (
      <MuiThemeProvider>
        <div className="nav-container">
          <div className="nav">
            <RaisedButton
              style={styles.button}
              icon={<Text color={'#565a5c'} hoverColor={'#EB5424'}/>}
              onTouchTap={() => {
                this._entryTypeOnClick('Text');
              }}
            />
            <RaisedButton
              style={styles.active}
              icon={<Video color={'#565a5c'} hoverColor={'#EB5424'}/>}
              onTouchTap={() => {
                this._entryTypeOnClick('Video');
              }}
            />
            <RaisedButton
              style={styles.active}
              icon={<Audio color={'#565a5c'} hoverColor={'#EB5424'}/>}
              onTouchTap={() => {
                this._entryTypeOnClick('Audio');
              }}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

  _detectMobileUser() {
    let mobile = false;
    if ( navigator.userAgent.match(/Android/i)
     || navigator.userAgent.match(/webOS/i)
     || navigator.userAgent.match(/iPhone/i)
     || navigator.userAgent.match(/iPad/i)
     || navigator.userAgent.match(/iPod/i)
     || navigator.userAgent.match(/BlackBerry/i)
     || navigator.userAgent.match(/Windows Phone/i)
   ) {
      mobile = true;
    }
    this.setState({
      mobile: mobile
    });
  }

  render() {
    return (
      <div className='new-entry-container'>
        {this.renderNav()}
        <div className="entry-type-container">
        {this.state.activeTab === 'Text' ? <TextEntry /> : null}
        {this.state.activeTab === 'Video' ? <VideoEntry mobile={this.state.mobile} _detectMobileUser={this._detectMobileUser} /> : null}
        {this.state.activeTab === 'Audio' ? <AudioEntry mobile={this.state.mobile} _detectMobileUser={this._detectMobileUser} /> : null}
        </div>
      </div>
    );
  }
}
