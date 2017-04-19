import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextEntry from '../textEntry/TextEntry';
import VideoEntry from '../videoEntry/VideoEntry';
import AudioEntry from '../audioEntry/AudioEntry';
import NewEntryNav from '../newEntryNav/NewEntryNav';

export default class NewEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'Text'
    };
    this.entryTypeOnClick = this.entryTypeOnClick.bind(this);
    this.entryType = this.entryType.bind(this);
    this.renderNav = this.renderNav.bind(this);
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

  render() {
    return (
      <div className='new-entry-container'>
        <h1> New {this.state.activeTab} Entry</h1>
        {this.renderNav()}
        {this.state.activeTab === 'Text' ? <TextEntry /> : null}
        {this.state.activeTab === 'Video' ? <VideoEntry /> : null}
        {this.state.activeTab === 'Audio' ? <AudioEntry /> : null}
      </div>
    );
  }
}

