import React from 'react';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.showLock = this.showLock.bind(this);
  }

  showLock() {
    this.props.lock.show();
  }
  render(){
    console.log('this da lock we passed down', this.props)
    return (
      <div className = 'login-box'>
        <a onClick={this.showLock}> by clicking rite here </a>
      </div>
    );
  }
}
