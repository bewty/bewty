import React from 'react';
import Loader from './components/loader/Loader.jsx';
import axios from 'axios';

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

  userLog() {
    let data = {};
    // console.log('Userlog triggered');
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

  render () {
    this.userLog();
    if (this.props.state.profile) {
      return (
        <div>
          <img className="profilePic" src={this.props.state.profile.picture} />
          <h2 className="profileName">Welcome!</h2>
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
