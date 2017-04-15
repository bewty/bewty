import React, { PropTypes } from 'react';
import UserProfile from '../UserProfile.jsx';
import axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idToken: null,
      profile: null,
      phonenumber: '',
    };
    this.getProfile = this.getProfile.bind(this);
    this.userLog = this.userLog.bind(this);
  }

  componentWillMount() {
    this.createLock();
    this.setState({
      idToken: this.getIdToken()
    });
    this.getProfile();
  }

  componentDidMount() {
    this.setState({
      phonenumber: JSON.parse(localStorage.smsCred).phoneNumber.number
    });
  }

  userLog() {
    let data = {
      phonenumber: this.state.phonenumber
    };
    axios.post('/db/userentry', data)
    .then((user_id) => {
      localStorage.setItem('user_id', user_id.data);
    })
    .then((res) => {
      console.log('Userlog sent to server');
    })
    .catch(err => console.log('text upload error...', err));
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
      //TODO: SAVE USERS NUMBER TO DB RIGHT HERE
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
    this.userLog();
    if (this.state.idToken && this.loggedIn()) {
      return (
          <div>
            <h2 className="profileName"> Welcome! </h2>
            <button onClick={this.logOut}> Logout </button>
          </div>
      );
    } else {
      return (
        <div >
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
