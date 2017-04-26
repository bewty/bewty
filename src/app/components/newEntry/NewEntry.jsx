import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextEntry from '../textEntry/TextEntry';
import VideoEntry from '../videoEntry/VideoEntry';
import AudioEntry from '../audioEntry/AudioEntry';

export default class NewEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'Text',
      mobile: false
    };
    this.entryTypeOnClick = this.entryTypeOnClick.bind(this);
    this.entryType = this.entryType.bind(this);
    this.renderNav = this.renderNav.bind(this);
    this._detectMobileUser = this._detectMobileUser.bind(this);
  }

  entryTypeOnClick(name) {
    this.setState({
      activeTab: name
    });
  }

  entryType(entryType) {
    return (
      <span onClick={() => this.entryTypeOnClick(entryType)} className={this.state.activeTab === entryType ? 'entry-type-btn active' : 'entry-type-btn'}>
        <span className={this.state.activeTab === entryType ? `${entryType} active` : entryType}></span>
      </span>
    );
  }

  renderNav() {
    return (
        <div className="new-entry-nav-container">
          {this.entryType('Text')}
          {this.entryType('Video')}
          {this.entryType('Audio')}
        </div>
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
        <h1 className="entry-header"> New {this.state.activeTab} Entry</h1>
        {this.renderNav()}
        <div className="entry-type-container">
        {this.state.activeTab === 'Text' ? <TextEntry /> : null}
        {this.state.activeTab === 'Video' ? <VideoEntry mobile={this.state.mobile} _detectMobileUser={this._detectMobileUser}/> : null}
        {this.state.activeTab === 'Audio' ? <AudioEntry mobile={this.state.mobile} _detectMobileUser={this._detectMobileUser}/> : null}
        </div>
      </div>
    );
  }
}

