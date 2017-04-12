import React from 'react';

export default class UserProfile extends React.Component {
  constructor(props) {
    super (props);
    this.logOut = this.logOut.bind(this)
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
      localStorage.setItem('id_token', id_token)
      this.props.getIdToken()
      //TODO: SAVE USERS NUMBER TO DB RIGHT HERE
    }
    }.bind(this))
  }

  logOut() {
    console.log('clicked')
    localStorage.removeItem('id_token');
    window.location.reload()
  }
  render () {
    if(this.state.profile) {
      return (
        <div>
          <img className="profilePic" src={this.state.profile.picture} />
          <h2 className="profileName"> Welcome! </h2>
          <button onClick={this.logOut}> Logout </button>
        </div>
      )
    } else {
      return (
        <div>
          <h1> we gon needchu to lawgin </h1>
          <div className="loading"> hold up... </div>
        </div>

      );
    }
  }
}
