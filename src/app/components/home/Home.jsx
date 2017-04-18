import React from 'react';

userLog = () => {
  let data = {
    phonenumber: JSON.parse(localStorage.smsCred).phoneNumber.number
  };
  axios.post('/db/userentry', data)
  .then((user_id) => {
    localStorage.setItem('loggedin', true);
    localStorage.setItem('user_id', user_id.data._id);
    localStorage.setItem('scheduled_message', user_id.data.scheduled_message);
    localStorage.setItem('scheduled_time', user_id.data.scheduled_time);
  })
  .catch((err) => {
    console.log('text upload error...', err);
  });
};

export default class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  userLog() {
    let data = {
      phonenumber: JSON.parse(localStorage.smsCred).phoneNumber.number
    };
    axios.post('/db/userentry', data)
    .then((user_id) => {
      localStorage.setItem('user_id', user_id.data._id);
      localStorage.setItem('scheduled_message', user_id.data.scheduled_message);
      localStorage.setItem('scheduled_time', user_id.data.scheduled_time);
    })
    .catch((err) => {
      console.log('text upload error...', err);
    });
  }

  componentDidMount() {
    this.userLog();
  }

  render() {
    return (
      <div className="container home">
        <h1>Home</h1>
      </div>
    );
  }
}



