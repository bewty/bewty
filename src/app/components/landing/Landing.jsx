import React from 'react';

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

        <div className="hero-container">
          <div className="hero-tagline-container">
            <h1>Mindfit</h1>
            <p></p>
          </div>
          <div className="hero-img-container">
          </div>
        </div>
      </div>
    );
  }
}
