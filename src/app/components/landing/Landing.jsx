import React from 'react';
import img from '../../../../public/assets/entries.png';
import gif from '../../../../public/assets/hero.gif';
import affectiva from '../../../../public/assets/affectiva.gif';
import emotion_data from '../../../../public/assets/emotion_data.png';
import personality from '../../../../public/assets/personality.gif';
import knowledge from '../../../../public/assets/knowledge_orange.png';
import callschedule_iphone from '../../../../public/assets/callschedule_iphone.gif';
import multimediaEntry from '../../../../public/assets/multimediaEntry.svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Text from 'material-ui/svg-icons/editor/text-fields';
import Video from 'material-ui/svg-icons/AV/videocam';
import Lock from 'material-ui/svg-icons/action/lock';
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
    <MuiThemeProvider>
      <div className="landing-container">
        <div className="hero-container ">

          <div className="hero-tagline-container">
            <div className="hero-tagline-text animated slideInLeft">
              <h1>Mind Fits</h1>
              <p>Isn’t it time we had a health tracker for your mind?</p>
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
                <p>Schedule a personal call with your personal question to track responses and receive analysis from IBM’s Watson.</p>
              </div>

          </div>
        </div>


          <div className="feature-entry-type-container">
            <img src={knowledge} className='knowledge-img animated slideInUp'/>
            <div className="feature-text animated slideInUp">
            <h1>Fitbit for Your Mind</h1>
            <p>Record entries via multiple media inputs, including video, audio, phone call or text and receive analysis in beautifully designed graphs</p>
        </div>
          </div>
        <div className="emotion-container">
          <div className="emotion-text-container animated slideInUp">
            <h1>Emotion Recognition</h1>
            <div className="emotion-icons">
              <Video color={'#fff'} style={{width: 40, height: 40, marginRight: 24}}/>
              <p>Analyze video entries for facial expressions and emotions</p>
            </div>
            <div className="emotion-icons">
              <Lock color={'#fff'} style={{width: 40, height: 40, marginRight: 24}}/>
              <p>Videos are safely locked away</p>
            </div>
          </div>
          <div className="emotion-img-container">
            <img src={affectiva} className='affectiva animated slideInUp'/>
          </div>
        </div>

        <div className="watson-container">
          <div className="watson-img-container">
            <img src={personality} className='watson animated slideInUp'/>
          </div>
          <div className="watson-text-container animated slideInUp">
            <h1>Track Personality Over Time</h1>
            <p>Using IBM Watson API to analyze multi-media entries overtime</p>
          </div>
        </div>
        <div className="testimony-container">
          <div className="testimony-text-container animated slideInUp">
            <h1>What People Are Saying</h1>
            <p>"This is the best App for journaling."</p>
            <p> -Bob</p>
          </div>
        </div>
        <div className="team-container">
          <div className="team-text-container animated slideInUp">
              <a href='https://github.com/blhwong' className="member">Brandon</a>
              <a href='https://github.com/esong7' className="member">Eugene</a>
              <a href='https://github.com/whitzhu' className="member">Whitney</a>
              <a href='https://github.com/tungnh91' className="member">Tim</a>
          </div>
        </div>
      </div>
      </MuiThemeProvider>
    );
  }
}
