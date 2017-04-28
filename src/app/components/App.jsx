import React, { PropTypes } from 'react';
import UserProfile from '../UserProfile.jsx';
import axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idToken: null,
      profile: null,
    };
    this.getProfile = this.getProfile.bind(this);
    this.userLog = this.userLog.bind(this);
  }

  componentWillMount() {
    this.createLock();
    this.setState({
      idToken: this.getIdToken()
    });
  }

  userLog() {
    let data = {};
    if (localStorage.smsCred) {
      data.phonenumber = JSON.parse(localStorage.smsCred).phoneNumber.number;
    }
    axios.post('/db/userentry', data)
    .then((user_id) => {
      localStorage.setItem('user_id', user_id.data._id);
      localStorage.setItem('scheduled_message', user_id.data.scheduled_message);
      localStorage.setItem('scheduled_time', user_id.data.scheduled_time);
    })
    .catch((err) => {
      // console.log('text upload error...', err);
      // TODO: HANDLE ERROR
    });
  }

  createLock() {
    this.lock = new Auth0LockPasswordless('8Xf5mRZcDDcMo0Dkl7OvMLP7ai9jULsn', 'tungnh91.auth0.com');
    this.getIdToken();
  }

  getProfile(profile, id_token) {
    this.setState({
      profile: profile
    });
    localStorage.setItem('id_token', id_token);
  }


  getIdToken() {
    //check if there's a token already
    var idToken = localStorage.getItem('id_token');
    var authHash = this.lock.parseHash(window.location.hash);
    // if theres none in LS but theres one in the URL hash, save it to LS
    if (!idToken && authHash) {
      if (authHash.id_token) {
        idToken = authHash.id_token;
        localStorage.setItem('id_token', authHash.id_token);
      }
      if (authHash.error) {
        // TODO: HANDLE ERROR
        // console.log('error from parseHash yo', authHash);
      }
    }
    return idToken;
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = localStorage.getItem('id_token');
    return !!token;
  }

  logOut() {
    localStorage.removeItem('id_token');
    window.location.reload();
  }

  render() {
    if (this.state.idToken !== 'undefined' && this.loggedIn()) {
      this.userLog();
      return (
        <div className="container">
          <h2 className="profileName">Welcome!</h2>
        </div>
      );
    } else {
      return (
        <div className="container">
          <UserProfile
            lock={this.lock}
            getIdToken={this.getIdToken}
            logOut={this.logOut}
            state={this.state}
            getProfile={this.getProfile}
            >
          </UserProfile>
        </div>
      );
    }
  }
}
