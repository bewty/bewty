import React from 'react';
import img from '../../../../public/assets/entries.png';
import gif from '../../../../public/assets/hero.gif';

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
            <div className="hero-tagline-text">
              <h1>Mind Fits</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Praesent nec volutpat enim.</p>
            <p></p>
            </div>
            <div className="hero-cta">
              <button className="cta-button">Test Demo</button>
            </div>
          </div>
          <div className="hero-img-container">
            <img className="hero-img" src={gif} />
          </div>
        </div>

        <div className="feature-container box">
           <div className='wave -one'></div>
          <div className='wave -two'></div>
          <div className='wave -three'></div>
        </div>

        <div className="feature-entry-type-container">
          <div>
            <h1>Entry Types</h1>
          </div>
        </div>
      </div>
    );
  }
}
