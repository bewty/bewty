import React from 'react';

export default class Login extends React.Component {
  constructor(props) {
    super (props);
  }
  state = {
    profile: null
  }
  componentDidMount() {
    console.log('this da lock we passin down', this.props.lock)
    this.props.lock.getProfile(this.props.idToken, function (err, profile) {
    if (err) {
      console.log("Error inside componentDidMount under getProfile", err);
      return;
    }
    else {
      this.setState({
       profile: profile
      })
    }
    }.bind(this))
  }

  render () {
    if(this.state.profile) {
      console.log('user info =====', this.state.profile)
      return (
        <div>
          <img className="profilePic" src={this.state.profile.picture} />
          <h2 className="profileName"> Welcome back {this.state.profile.name} ! </h2>
        </div>
      )
    } else {
      return (
        <div className="loading"> hold up... </div>
      );
    }
  }
}
