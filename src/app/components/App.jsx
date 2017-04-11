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

  render() {
    if (this.state.idToken) {
      return (<UserProfile lock={this.lock} idToken={this.state.idToken} />);
    } else {
      return (
        <div >
          <UserProfile lock={this.lock} getIdToken={this.getIdToken}> </UserProfile>
        </div>
      )
    }
  }
}
