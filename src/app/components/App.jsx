import React, { PropTypes } from 'react';
import UserProfile from '../UserProfile.jsx';
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    idToken:null
  }
  componentWillMount() {
    this.createLock();
    this.setState({
      idToken: this.getIdToken()
    })
  }
  createLock() {
    this.lock = new Auth0LockPasswordless('8Xf5mRZcDDcMo0Dkl7OvMLP7ai9jULsn', 'tungnh91.auth0.com');
    this.getIdToken()
  }

  getIdToken() {
    console.log('this da lock', this.lock)
    //check if there's a token already
    var idToken = localStorage.getItem('id_token');
    var authHash = this.lock.parseHash(window.location.hash);
    // if theres none in LS but theres one in the URL hash, save it to LS
    if (!idToken && authHash) {
      if (authHash.id_token) {
        idToken = authHash.id_token
        localStorage.setItem('id_token', authHash.id_token);
      }
      if(authHash.error) {
        console.log('error from parseHash yo', authHash);
      }
    }
    return idToken;
  }

   loggedIn(){
    // Checks if there is a saved token and it's still valid
    const token = localStorage.getItem('id_token');
    return !!token
  }
  render() {
    console.log(this.state.idToken, 'token')
    console.log(this.loggedIn(), 'isLoggedIn')
    if (this.state.idToken && this.loggedIn()) {
      return (
          <div>
            <h2 className="profileName"> Welcome! </h2>
            <button> Logout </button>
          </div>
      );
    } else {
      return (
        <div >
          <UserProfile lock={this.lock} getIdToken={this.getIdToken}> </UserProfile>
        </div>
      )
    }
  }
}
