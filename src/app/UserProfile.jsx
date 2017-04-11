import React from 'react';

export default class UserProfile extends React.Component {
  constructor(props) {
    super (props);
  }
  state = {
    profile: null
  }
  componentDidMount() {
    console.log('this da lock we passin down', this.props.lock)
    var appearanceOpts = {
      autoclose: true
    };
    this.props.lock.sms(appearanceOpts,function (error, profile, id_token, access_token, state, refresh_token) {
    if (error) {
      console.log("Error inside componentDidMount under getProfile", err);
      return;
    }
    else {
      this.setState({
       profile: profile
      })
      //TODO: SAVE USERS NUMBER TO DB RIGHT HERE
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
        <div>
          <h1> yeah we needchu to lawgin </h1>
          <div className="loading"> hold up... </div>
        </div>

      );
    }
  }
}
