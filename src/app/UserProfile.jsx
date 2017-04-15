import React from 'react';
import Loader from './components/loader/Loader.jsx';


export default class UserProfile extends React.Component {
  constructor(props) {
    super (props);
  }
  componentDidMount() {
    var appearanceOpts = {
      autoclose: true
    };
    this.props.lock.sms(appearanceOpts, function (error, profile, id_token, access_token, state, refresh_token) {
      if (error) {
        // console.log("Error inside componentDidMount under getProfile", err);
        // TODO: HANDLE ERROR
        return;
      } else {
        this.props.getProfile(profile, id_token);
      }
    }.bind(this));
  }

  render () {
    if (this.props.state.profile) {
      return (
        <div>
          <img className="profilePic" src={this.props.state.profile.picture} />
          <h2 className="profileName">Welcome!</h2>
          <button onClick={this.props.logOut.bind(this)}>Logout</button>
        </div>
      );
    } else {
      return (
        <div>
          <h1> Please login </h1>
          <Loader />
        </div>
      );
    }
  }
}
