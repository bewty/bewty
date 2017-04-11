// import React from 'react';
//
// export default class Login extends React.Component {
//   constructor(props) {
//     super(props);
//     this.showLock = this.showLock.bind(this);
//   }
//   state = {
//     profile:null
//   }
//
//   showLock() {
//   var appearanceOpts = {
//       autoclose: true
//     };
//     this.props.lock.sms(appearanceOpts,function (error, profile, id_token, access_token, state, refresh_token) {
//       if (!error) {
//       this.setState({
//        profile: profile
//       })
//       // save phone number to DB
//       console.log('this da profile we collect')
//       }
//       if(error){
//         console.log('error from showLock in Login', error)
//       }
//     });
//   }
//   render(){
//     console.log('this da lock we passed down', this.props)
//     return (
//       <div className = 'login-box'>
//         <a onClick={this.showLock}> by clicking rite here </a>
//       </div>
//     );
//   }
// }
//
