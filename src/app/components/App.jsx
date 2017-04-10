import React, { PropTypes } from 'react';
import Login from '../Login.jsx';

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
    this.lock = new Auth0Lock('8Xf5mRZcDDcMo0Dkl7OvMLP7ai9jULsn', 'tungnh91.auth0.com')
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
    return (
      <div >
        <h1> we needchu to lawgin dawg </h1>
        <Login lock={this.lock}> </Login>
      </div>
    )
  }
}
