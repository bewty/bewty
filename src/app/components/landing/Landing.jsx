import React from 'react';
import img from '../../../../public/assets/entries.png';
import gif from '../../../../public/assets/hero.gif';
import knowledge from '../../../../public/assets/knowledge.png';
import callschedule_iphone from '../../../../public/assets/callschedule_iphone.gif';
import multimediaEntry from '../../../../public/assets/multimediaEntry.svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Text from 'material-ui/svg-icons/editor/text-fields';
import Video from 'material-ui/svg-icons/AV/videocam';
import Audio from 'material-ui/svg-icons/AV/mic';

export default class Landing extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="landing-container">
        <div className="hero-container ">

          <div className="hero-tagline-container">
            <div className="hero-tagline-text animated slideInLeft">
              <h1>Mind Fits</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Praesent nec volutpat enim.</p>
            </div>
            <div className="hero-cta">
              <button className="cta-button animated slideInLeft">Sign Up</button>
            </div>
          </div>
          <div className="hero-img-container">
            <img className="hero-img" src={gif} />
          </div>
        </div>

        <div className='feature-container box'>
          <div className='wave -one'></div>
          <div className='wave -two'></div>
          <div className='wave -three'></div>
          <div className='feature-content'>
            <img src={callschedule_iphone} className='callschedule_iphone-img animated slideInLeft'/>
            <div className="multimediaEntry"></div>
              <div className="feature-text">
                <h1>Schedule Calls</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent nec volutpat enim.</p>
              </div>

          </div>
        </div>

        <MuiThemeProvider>
          <div className="feature-entry-type-container">
            <div className='entry-type'>
              <Text color={'#565a5c'} hoverColor={'#EB5424'}/>
              <p>Text</p>
            </div>
            <div className='entry-type'>
              <Video color={'#565a5c'} hoverColor={'#EB5424'}/>
              <p>Video</p>
            </div>
            <div className='entry-type'>
              <Audio color={'#565a5c'} hoverColor={'#EB5424'} style={{width: 200, height: 200}}/>
              <p>Audio</p>
            </div>
          </div>
        </MuiThemeProvider>
        <div className="footer">
          <a href='https://github.com/blhwong' className="member">Brandon</a>
          <a href='https://github.com/esong7' className="member">Eugene</a>
          <a href='https://github.com/whitzhu' className="member">Whitney</a>
          <a href='https://github.com/tungnh91' className="member">Tim</a>
        </div>
      </div>
    );
  }
}
